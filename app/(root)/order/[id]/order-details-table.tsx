'use client'

import { formatDateTime, formatId, formatCurrency } from '@/lib/utils';
import { order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { createPayPalOrder, approvePayPalOrder, updateOrderToPaidCOD, deliverOrder } from '@/lib/actions/order.actions';

const OrderDetailsTable = ({ order, PaypalClientId, isAdmin }: {
  order: Omit<order, 'paymentResult'>; PaypalClientId: string; isAdmin: boolean
}) => {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    if (isPending) {
      return <p className="text-sm text-muted-foreground mb-2">Loading PayPal...</p>;
    }
    if (isRejected) {
      return <p className="text-sm text-destructive mb-2">Error Loading PayPal</p>;
    }

    return null;
  };

  const handleCreatePaypalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) {
      toast.error(res.message);
      return ''; // Must return string even on failure
    }
    return res.data; // orderID string
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();


    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Paid'}
      </Button>
    );
  };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
           toast(res.success ? 'Success' : 'Error', {
              description: res.message,
            });
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Delivered'}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl font-semibold">Order {formatId(order.id)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-4">
          {/* Payment Method */}
          <Card className="p-4">
            <CardContent className="space-y-3">
              <h2 className="text-xl font-medium pb-2">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid && paidAt ? (
                <Badge variant="secondary">Paid at {formatDateTime(paidAt).dateTime}</Badge>
              ) : (
                <Badge variant="destructive">Not paid</Badge>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="p-4">
            <CardContent className="space-y-3">
              <h2 className="text-xl font-medium pb-2">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city} {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
              {isDelivered && deliveredAt ? (
                <Badge variant="secondary">Delivered at {formatDateTime(deliveredAt).dateTime}</Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-medium pb-2">Order Summary</h2>
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {/* PayPal Payment Section */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <PayPalScriptProvider options={{ clientId: PaypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons createOrder={handleCreatePaypalOrder} onApprove={handleApprovePayPalOrder} />
                </PayPalScriptProvider>
              )}

              {/* Cash on delivery */}
              
              {
                isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                  <MarkAsPaidButton />
                )
              }
              {
                isAdmin && isPaid && !isDelivered  && (
                  <MarkAsDeliveredButton />
                )
              }

            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
