"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import CartDrawer from './CartDrawer';

export const GlobalCart = () => {
  const { user, spendTokens } = useUser();
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice
  } = useCart();

  const router = useRouter();

  const handleConfirmPurchase = () => {
    if (cart.length === 0) return;
    setIsOpen(false);
    router.push('/market/checkout/cart');
  };

  return (
    <CartDrawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      items={cart as any}
      onRemove={removeFromCart}
      onQtyChange={updateQuantity}
      onConfirm={handleConfirmPurchase}
      tokenBalance={user.tokens}
    />
  );
};

export default GlobalCart;
