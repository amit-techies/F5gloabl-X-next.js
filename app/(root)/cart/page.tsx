import CartTable from "./cart-tble";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata ={
    title: 'Shopping Cart'
}

const cartPage = async () => {

    const cart = await getMyCart();

    return ( 
<CartTable cart={cart} />
     );
}
 
export default cartPage;