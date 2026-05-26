import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const CATEGORIES = [
  { name: 'Beauty Picks', description: 'Skincare, makeup and fragrance.' },
  { name: 'Computers & Accessories', description: 'Laptops, peripherals and more.' },
  { name: 'Video Games', description: 'Consoles, titles and gaming gear.' },
  { name: 'Toys & Games', description: 'Fun for every age.' },
  { name: 'Home & Kitchen', description: 'Everything for your space.' },
];

const CATEGORY_IMAGES: Record<string, string> = {
  'beauty-picks':
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
  'computers-accessories':
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'video-games':
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
  'toys-games':
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
  'home-kitchen':
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
};

const PRODUCT_IMAGES: Record<string, string[]> = {
  'Wireless Noise-Cancelling Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  ],
  'Mechanical Keyboard RGB': [
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
  ],
  '27" 4K UltraSharp Monitor': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1588200908342-23b585c03e26?auto=format&fit=crop&w=900&q=80',
  ],
  'Ergonomic Wireless Mouse': [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
  ],
  'Hydrating Vitamin C Serum': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  ],
  'Matte Lipstick Collection': [
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1599733589046-10c005739ef1?auto=format&fit=crop&w=900&q=80',
  ],
  'Next-Gen Gaming Console': [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=80',
  ],
  'Open-World Adventure Game': [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=900&q=80',
  ],
  'Pro Wireless Controller': [
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=900&q=80',
  ],
  'Building Blocks Mega Set': [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80',
  ],
  'Remote Control Racing Car': [
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=900&q=80',
  ],
  'Stainless Steel Cookware Set': [
    'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
  ],
};

async function main() {
  console.log('Seeding database...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all(
    CATEGORIES.map((c) => {
      const slug = slugify(c.name);
      return prisma.category.create({
        data: {
          name: c.name,
          slug,
          description: c.description,
          imageUrl: CATEGORY_IMAGES[slug],
        },
      });
    }),
  );
  console.log(`Created ${categories.length} categories`);

  const productSeeds = [
    {
      title: 'Wireless Noise-Cancelling Headphones',
      cat: 1,
      price: 24999,
      compare: 34999,
      featured: true,
    },
    { title: 'Mechanical Keyboard RGB', cat: 1, price: 8999, compare: 11999, featured: true },
    { title: '27" 4K UltraSharp Monitor', cat: 1, price: 39999, compare: null, featured: true },
    { title: 'Ergonomic Wireless Mouse', cat: 1, price: 4999, compare: 6499, featured: false },
    { title: 'Hydrating Vitamin C Serum', cat: 0, price: 2999, compare: 3999, featured: true },
    { title: 'Matte Lipstick Collection', cat: 0, price: 1999, compare: null, featured: false },
    { title: 'Next-Gen Gaming Console', cat: 2, price: 49999, compare: null, featured: true },
    { title: 'Open-World Adventure Game', cat: 2, price: 5999, compare: 6999, featured: false },
    { title: 'Pro Wireless Controller', cat: 2, price: 6999, compare: 7999, featured: true },
    { title: 'Building Blocks Mega Set', cat: 3, price: 3499, compare: 4499, featured: false },
    { title: 'Remote Control Racing Car', cat: 3, price: 4299, compare: null, featured: true },
    {
      title: 'Stainless Steel Cookware Set',
      cat: 4,
      price: 12999,
      compare: 15999,
      featured: false,
    },
  ];

  for (const [i, p] of productSeeds.entries()) {
    await prisma.product.create({
      data: {
        title: p.title,
        slug: `${slugify(p.title)}-${i}`,
        description: `${p.title} blends polished design, dependable performance and everyday value. Ships quickly with careful packaging and includes a 30-day return policy.`,
        priceCents: p.price,
        comparePriceCents: p.compare,
        stock: 25 + i * 3,
        images: PRODUCT_IMAGES[p.title],
        rating: Number((3.8 + (i % 5) * 0.25).toFixed(1)),
        reviewCount: 12 + i * 7,
        isFeatured: p.featured,
        categoryId: categories[p.cat].id,
      },
    });
  }
  console.log(`Created ${productSeeds.length} products`);

  const adminPass = await bcrypt.hash('Admin123!', 12);
  const customerPass = await bcrypt.hash('Customer123!', 12);

  await prisma.user.create({
    data: {
      email: 'admin@shop.dev',
      passwordHash: adminPass,
      firstName: 'Site',
      lastName: 'Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  await prisma.user.create({
    data: {
      email: 'customer@shop.dev',
      passwordHash: customerPass,
      firstName: 'Demo',
      lastName: 'Customer',
      isVerified: true,
      cart: { create: {} },
    },
  });
  console.log('Created admin@shop.dev / Admin123! and customer@shop.dev / Customer123!');
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
