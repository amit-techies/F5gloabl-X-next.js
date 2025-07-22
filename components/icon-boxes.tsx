import {
  DollarSign,
  Headset,
  ShoppingBag,
  WalletCards,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    icon: ShoppingBag,
    title: 'Free Shipping',
    description: 'Free shipping on orders above $100',
  },
  {
    icon: DollarSign,
    title: 'Money Back Guarantee',
    description: 'Within 30 days of purchase',
  },
  {
    icon: WalletCards,
    title: 'Flexible Payment',
    description: 'Pay with credit card, PayPal or COD',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    description: 'Get support at any time',
  },
];

const IconBoxes = () => {
  return (
    <Card className="shadow-md rounded-2xl">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center text-center space-y-3">
            <Icon className="w-8 h-8 text-primary" />
            <div className="text-base font-semibold">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IconBoxes;
