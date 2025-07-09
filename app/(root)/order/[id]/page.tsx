import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";


export const metadata:Metadata = {
    title:'order-details'
}

const orderDeatilsPage = async (props:{
    params:Promise<{
        id: string
    }>
}) => {

    const { id } = await props.params;
    const order = await getOrderById(id);
    if(!order) notFound();


    return ( <>details {order.totalPrice}</> );
}
 
export default orderDeatilsPage;