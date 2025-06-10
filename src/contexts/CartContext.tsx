"use client";

import type { Product, CartItem, CartState } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

const SHIPPING_COST = 5.00;
const FREE_SHIPPING_THRESHOLD = 50.00;
const TAX_RATE = 0.07; // 7%

const CartContext = createContext<CartState | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('boutiqueMinimalCart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('boutiqueMinimalCart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const getCartSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getShippingCost = useCallback(() => {
    const subtotal = getCartSubtotal();
    return subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_COST : 0;
  }, [getCartSubtotal]);

  const getTaxes = useCallback(() => {
    return getCartSubtotal() * TAX_RATE;
  }, [getCartSubtotal]);

  const getCartTotal = useCallback(() => {
    return getCartSubtotal() + getShippingCost() + getTaxes();
  }, [getCartSubtotal, getShippingCost, getTaxes]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getItemCount,
        getCartSubtotal,
        getShippingCost,
        getTaxes,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
