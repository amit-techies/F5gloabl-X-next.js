"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { redirect } from "next/navigation";

// Create order and order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("user is not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("user not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    // ✅ Parse order data with Zod (convert Decimal -> string for validation)
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice.toString(), 
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(), 
      totalPrice: cart.totalPrice.toString(),
    });

    // Create order and items in transaction
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order (convert string -> number for Prisma)
      const insertOrder = await tx.order.create({
        data: {
          userId: order.userId,
          shippingAddress: order.shippingAddress, // this should be a valid JSON object
          paymentMethod: order.paymentMethod,
          itemsPrice: Number(order.itemsPrice),
          shippingPrice: Number(order.shippingPrice),
          taxPrice: Number(order.taxPrice),
          totalPrice: Number(order.totalPrice),
          // paidAt: new Date(), // or null if you want to change your model to optional
          // deliveredAt: new Date(), // or null
        },
      }); 

      // Create order items from cart
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            productId: item.productId,
            slug: item.slug,
            image: item.image,
            name: item.name,
            qty: item.qty,
            price: Number(item.price),
            orderId: insertOrder.id,
          },
        });
      }

      // Clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };

  } catch (error) {
    if (!isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}


// get order by id
export async function getOrderById(orderId: string){
  const data = await prisma.order.findFirst({
    where:{
      id:orderId
    },
    include:{
      orderItems: true,
      user:{select:{name:true,email:true}},
    }
  })
  return convertToPlainObject(data);
}