import { prisma } from "@/db/prisma"; // or relative like "./db/prisma"

import sampleData from "./sample-data";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

  console.log("✅ Database seeded with sample data.");
}

main().catch((e) => {
  console.error("❌ Error seeding database:", e);
  process.exit(1);
});
