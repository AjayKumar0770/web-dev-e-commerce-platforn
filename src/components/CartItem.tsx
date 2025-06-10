"use client";

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { XCircle, PlusCircle, MinusCircle } from 'lucide-react';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemDisplay({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
      <Link href={`/products/${item.id}`} className="flex-shrink-0">
        <div className="relative h-20 w-20 rounded-md overflow-hidden shadow">
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill 
            className="object-cover"
            sizes="80px"
            data-ai-hint={item.dataAiHint}
          />
        </div>
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
         <h3 className="text-md font-semibold font-headline">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <=1}>
          <MinusCircle className="h-4 w-4" />
        </Button>
        <Input 
          type="number" 
          value={item.quantity} 
          onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-12 h-8 text-center px-1"
          min="1"
        />
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <p className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
        <XCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
