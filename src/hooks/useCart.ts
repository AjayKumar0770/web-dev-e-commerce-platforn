"use client";

import CartContext from '@/contexts/CartContext';
import type { CartState } from '@/lib/types';
import { useContext } from 'react';

export const useCart = (): CartState => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
