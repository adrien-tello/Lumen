import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { slugify } from '../../utils/slug';
import type { ListProductsQuery } from './products.schema';

const sortMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: 'desc' },
  price_asc: { priceCents: 'asc' },
  price_desc: { priceCents: 'desc' },
  rating: { rating: 'desc' },
};

export const productsService = {
  async list(q: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = {};

    if (q.search) {
      where.OR = [
        { title: { contains: q.search, mode: 'insensitive' } },
        { description: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    if (q.category) where.category = { slug: q.category };
    if (q.featured !== undefined) where.isFeatured = q.featured;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: sortMap[q.sort],
        skip: (q.page - 1) * q.limit,
        take: q.limit,
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: q.page,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    };
  },

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true, slug: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  },

  async create(input: Prisma.ProductCreateInput & { categoryId: string }) {
    const { categoryId, ...rest } = input;
    return prisma.product.create({
      data: {
        ...rest,
        slug: `${slugify(input.title as string)}-${Date.now().toString(36)}`,
        category: { connect: { id: categoryId } },
      },
    });
  },

  async update(id: string, input: Prisma.ProductUpdateInput) {
    await prisma.product.findUniqueOrThrow({ where: { id } });
    return prisma.product.update({ where: { id }, data: input });
  },

  async remove(id: string) {
    await prisma.product.delete({ where: { id } });
  },
};
