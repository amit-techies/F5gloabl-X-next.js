import { z } from "zod";
import { formatNumberwithDecimalPlaces } from "@/lib/utils";
import { PAYMENT_METHODS } from "./constants";


const currency = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val).toFixed(2))
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(val),
    "Price must be a valid number with two decimal places"
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  // name: z.string().min(3, "Name is required"),
  // slug: z.string().min(3, "Slug is required"),
  // category: z.string().min(3, "Category is required"),
  // brand: z.string().min(3, "Brand is required").nullable().transform(val => val ?? ''), 
  // description: z.string().min(3, "Description is required"),
  // stock: z.coerce.number(),
  // images: z.array(z.string()).min(1, "At least one image is required"),
  // isFeatured: z.boolean(),
  // banner: z.string().nullable(),
  // price: currency,
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required'),
  category: z.string().min(3, 'Category is required'),
  brand: z.string().nullable(), // ✅ Allow null for brand
  description: z.string().min(3, 'Description is required'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(), // ✅ Allow null
  price: z.union([z.string(), z.number()]), // ✅ Accept string or number
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Id is required'),
});

// schema for  signing user in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be a least 6 characters"),
});

// schema for  sign up user in
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be a least 6 characters"),
    confirmpassword: z
      .string()
      .min(6, "confirm Password must be a least 6 characters"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "password don't match",
    path: ["confirmpassword"],
  });

// cart schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

//schema for the shipping addrees
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// schema for the payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "user is required"),
  itemsPrice: currency, // ✅ MATCHES Prisma model
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});





// schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number()
});

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// schema for updating  the user pofile
export const updateProfileSchema = z.object({
  name:z.string().min(3,'Name must be atleast 3 characters'),
  email:z.string().min(3,'Name must be atleast 3 characters'),
})

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'ID is required'),
  role: z.string().min(1, 'Role is required'),
});

// Schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  productId: z.string().min(1, 'Product is required'),
  userId: z.string().min(1, 'User is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});