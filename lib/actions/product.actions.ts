
import { prisma } from "@/db/prisma";

//Get latest Products
export async function getLatestProduct() {

  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });
  return data;
}

//Get single Products
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {slug: slug},
  });
}