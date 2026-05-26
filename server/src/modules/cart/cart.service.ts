import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';

/** Loads (or lazily creates) the user's cart with computed totals. */
async function getCartWithTotals(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true }, orderBy: { createdAt: 'asc' } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return { ...cart, subtotalCents, itemCount };
}

export const cartService = {
  get: getCartWithTotals,

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw ApiError.notFound('Product not found');
    if (product.stock < quantity) throw ApiError.badRequest('Not enough stock available');

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // Upsert keeps a single row per product; quantity accumulates.
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    return getCartWithTotals(userId);
  },

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId } });

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    } else {
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity },
      });
    }
    return getCartWithTotals(userId);
  },

  async removeItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId } });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    return getCartWithTotals(userId);
  },

  async clear(userId: string) {
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId } });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return getCartWithTotals(userId);
  },
};
