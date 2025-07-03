'use client';

import { CartItem, Cart } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Plus, Minus } from "lucide-react";


const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const rest = await addItemToCart(item);

    if (!rest.success) {
      toast.error(rest.message); 
      return;
    }
     
    // success toast with action
    toast.success(rest.message, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };
  // handle remove item from cart
  const handleRemoverFromCart  = async () => {
    const res = await removeItemFromCart(item.productId);

   if (res.success) {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }

  return;
};

  // check if item is in cart
  const existItem = cart && cart.items.find((x)=> x.productId === item.productId);
  return ( existItem ? (
    <div>
     <Button type="button" variant='outline' onClick={handleRemoverFromCart}>
     <Minus className="h-4 w-4" />
    </Button>
    <span className="px-2">{existItem.qty}</span>
    <Button type="button" variant='outline' onClick={handleAddToCart}>
     <Plus className="h-4 w-4" />
    </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
     <Plus /> Add To Cart
    </Button>
  )
    
  );
};

export default AddToCart;
