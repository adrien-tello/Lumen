import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';

export const categoriesService = {
  list() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  },

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  },
};
