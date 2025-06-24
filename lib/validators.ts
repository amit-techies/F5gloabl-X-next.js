import { z } from 'zod';
import { formatNumberwithDecimalPlaces } from '@/lib/utils';

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberwithDecimalPlaces(Number(value))),
    'Price must be a valid number with two decimal places'
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required'),
  category: z.string().min(3, 'Category is required'),
  brand: z.string().min(3, 'Brand is required').nullable(), // ✅ FIXED
  description: z.string().min(3, 'Description is required'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
