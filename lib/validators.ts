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


// schema for  signing user in
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6,'Password must be a least 6 characters'),
});

// schema for  sign up user in
export const signUpFormSchema = z.object({
  name : z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6,'Password must be a least 6 characters'),
   confirmpassword: z.string().min(6,'confirm Password must be a least 6 characters'),
}).refine((data) => data.password === data.confirmpassword,{
  message: "password don't match",
  path:['confirmpassword'],
} );

// cart schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency
});

export const insertCartSchema = z.object({
items: z.array(cartItemSchema),
itemsPrice: currency,
totalPrice: currency,
shippingPrice: currency,
taxPrice: currency,
sessionCartId: z.string().min(1, 'Session cart id is required'),
userId: z.string().optional().nullable(),
})