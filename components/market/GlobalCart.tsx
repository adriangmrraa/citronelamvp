"use client";

import React from 'react';
import { useCart } from '@/hooks/useCart';
import CartDrawer from './CartDrawer';

export const GlobalCart = () => {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const handleConfirmPurchase = async () => {
    // Simular proceso de compra
    console.log("Confirmando canje...");
    await new Promise(r => setTimeout(r, 1000));
    setIsOpen(false);
    // Podrías agregar una notificación global aquí si quisieras
  };

  return (
    <CartDrawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      items={cart as any}
      onRemove={removeFromCart}
      onQtyChange={updateQuantity}
      onConfirm={handleConfirmPurchase}
    />
  );
};

export default GlobalCart;
