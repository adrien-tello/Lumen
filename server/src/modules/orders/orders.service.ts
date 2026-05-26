import { prisma } from '../../config/prisma';
import { DEFAULT_CURRENCY, getShippingCents } from '../../config/pricing';
import { ApiError } from '../../utils/ApiError';

interface ShippingInput {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZip: string;
}

export const ordersService = {
  /**
   * Creates an order from the user's current cart inside a transaction:
   * validates stock, snapshots prices, decrements inventory, clears the cart.
   */
  async checkout(userId: string, shipping: ShippingInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Your cart is empty');
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${item.product.title}"`);
      }
    }

    const currency = cart.items[0]?.product.currency ?? DEFAULT_CURRENCY;
    const hasMixedCurrency = cart.items.some((item) => item.product.currency !== currency);
    if (hasMixedCurrency) {
      throw ApiError.badRequest('Cart contains products with mixed currencies');
    }

    const subtotalCents = cart.items.reduce(
      (sum, item) => sum + item.product.priceCents * item.quantity,
      0,
    );
    const shippingCents = getShippingCents(subtotalCents);
    const totalCents = subtotalCents + shippingCents;

    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalCents,
          currency,
          ...shipping,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceCents: item.product.priceCents,
              titleSnapshot: item.product.title,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement stock for each purchased product.
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Empty the cart.
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  },

  listForUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  },

  async getById(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
    if (!order || order.userId !== userId) throw ApiError.notFound('Order not found');
    return order;
  },
};
