import { PrismaClient } from "@prisma/client";


//Get latest Products
export async function getLatestProduct() {
const prisma = new PrismaClient()
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });
  return data;
}

//Get single Products
export async function getProductBySlug(slug: string) {
  const prisma = new PrismaClient()  
  return await prisma.product.findFirst({
    where: {slug: slug},
  });
}