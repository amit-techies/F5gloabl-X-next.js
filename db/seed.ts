import * as dotenv from "dotenv";
dotenv.config(); // Loads .env file

// import { PrismaClient } from "@prisma/client";
// import { prisma } from "./prisma";
import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data"; // Make sure this path is correct

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.product.deleteMany(); // Optional: clear existing data
    await prisma.product.createMany({ data: sampleData.products });

    console.log("✅ Database seeded with sample data.");
  } catch (e) {
    console.error("❌ Error seeding database:", e);   
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
