'use client';
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validators";
import { toast } from 'sonner'; 
import CheckoutSteps from "@/components/shared/checkout-steps"; 

const PaymentMethodForm = ({preferredPaymentMethod} : { preferredPaymentMethod: string | null;
}) => {

const router = useRouter();
return(<>
<CheckoutSteps current={2}/>
</>)
}

export default PaymentMethodForm;