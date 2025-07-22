// import { Resend } from 'resend';
// import { SENDER_EMAIL,APP_NAME } from '@/lib/constants';
// import { order } from "@/types";
// require('dotenv').config();
// import PurchaseReceiptEmail from './purchase-receipt';

// const resend = new Resend(process.env.RESEND_API_KEY as string);

// export const sendPurchaseReceipt = async ({order}:{order:order})=>{
//    await resend.emails.send({
//     from : `${APP_NAME} <${SENDER_EMAIL}>`,
//     to : order.user.email,
//     subject : `Order Confirmation ${order.id}`,
//     react : <PurchaseReceiptEmail order={order}/>,
//    })
// };

import { Resend } from 'resend';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { order } from "@/types";
import PurchaseReceiptEmail from './purchase-receipt';
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: order }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not set in .env');
    }

    if (!order?.user?.email) {
      throw new Error('User email missing from order');
    }

    const res = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: `Order Confirmation ${order.id}`,
      react: <PurchaseReceiptEmail order={order} />,
    });

    console.log('📨 Email sent:', res);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};




