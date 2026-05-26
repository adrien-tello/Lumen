import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import type { RegisterInput, LoginInput } from './auth.schema';

/** Shape returned to the client — never includes the password hash. */
const publicUser = (u: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}) => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  role: u.role,
});

const issueTokens = async (userId: string, role: string) => {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId, role });

  // Persist refresh token so it can be revoked.
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw ApiError.conflict('An account with this email already exists');

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: await hashPassword(input.password),
        firstName: input.firstName,
        lastName: input.lastName,
        // Each user gets an empty cart on registration.
        cart: { create: {} },
      },
    });

    const tokens = await issueTokens(user.id, user.role);
    return { user: publicUser(user), ...tokens };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');

    const tokens = await issueTokens(user.id, user.role);
    return { user: publicUser(user), ...tokens };
  },

  async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token is invalid or expired');
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Refresh token is invalid');
    }

    // Rotate: invalidate the old token, issue a fresh pair.
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    return issueTokens(payload.userId, payload.role);
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');
    return publicUser(user);
  },
};
