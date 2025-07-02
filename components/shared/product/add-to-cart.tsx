'use client';

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { Plus } from "lucide-react";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const rest = await addItemToCart(item);

    if (!rest.success) {
      toast.error(rest.message); 
      return;
    }

    // success toast with action
    toast.success(`${item.name} added to cart`, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
     <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
