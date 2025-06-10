"use client";

import { useCart } from '@/hooks/useCart';
import { CartItemDisplay } from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { items, getItemCount, getCartSubtotal, getShippingCost, getTaxes, getCartTotal, clearCart } = useCart();

  if (getItemCount() === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-headline mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-headline mb-8">Your Shopping Cart</h1>
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {items.map(item => (
              <div key={item.id} className="px-6">
                 <CartItemDisplay item={item} />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="mt-6 text-right">
            <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                Clear Cart
            </Button>
        </div>
      </div>

      <div className="md:col-span-1 sticky top-24">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getCartSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${getShippingCost().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (7%)</span>
              <span>${getTaxes().toFixed(2)}</span>
            </div>
            <Separator className="my-3"/>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <CreditCard className="mr-2 h-5 w-5"/> Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
