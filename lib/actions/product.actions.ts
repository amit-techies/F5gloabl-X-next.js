import { prisma } from '@/db/prisma';

export async function getLatestProduct() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });
  return data;
}
