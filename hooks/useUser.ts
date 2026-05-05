'use client';

import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';

export interface Transaction {
  id: string;
  type: 'purchase' | 'reward' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Reservation {
  id: string;
  eventId: number;
  categoryName: string;
  qrCode: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  tokens: number;
  history: Transaction[];
  reservations: Reservation[];
  isLoggedIn: boolean;
}

export function useUser() {
  const { 
    username, 
    tokens, 
    transactions, 
    addTransaction, 
    isLoggedIn 
  } = useUserContext();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRes = localStorage.getItem('citro_user_reservations');
    if (savedRes) {
      setReservations(JSON.parse(savedRes));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('citro_user_reservations', JSON.stringify(reservations));
    }
  }, [reservations, isLoaded]);

  // Map context data to the old UserProfile interface for compatibility
  const user: UserProfile = {
    name: username,
    email: 'usuario@citronela.club',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    role: 'Cultivador Élite',
    tokens: tokens,
    history: transactions.map(tx => ({
      id: tx.id,
      type: tx.type === 'purchase' ? 'purchase' : 'reward',
      amount: tx.tokensValue,
      description: tx.title,
      date: tx.date,
      status: 'completed'
    })),
    reservations: reservations,
    isLoggedIn: isLoggedIn
  };

  const spendTokens = (amount: number, description: string, productId?: string | string[], eventId?: string) => {
    if (tokens < amount) return false;

    const transactionId = `#${Math.floor(10000000 + Math.random() * 90000000)}`;

    addTransaction({
      type: eventId ? 'event' : 'purchase',
      title: description,
      amount: `-${amount} TOKENS`,
      tokensValue: -amount,
      description: eventId ? 'Reserva de evento' : 'Canje de producto',
      productId: typeof productId === 'string' ? productId : undefined,
      productIds: Array.isArray(productId) ? productId : undefined,
      eventId: eventId
    });

    return transactionId;
  };

  const addTokens = (amount: number, description: string) => {
    addTransaction({
      type: 'token_buy',
      title: description,
      amount: `+${amount} TOKENS`,
      tokensValue: amount,
      description: 'Carga de tokens'
    });
  };

  const addReservation = (eventId: number, categoryName: string, qrCode: string) => {
    const newRes: Reservation = {
      id: `res_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      categoryName,
      qrCode,
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [newRes, ...prev]);
  };

  return {
    user,
    isLoaded,
    spendTokens,
    addTokens,
    addReservation
  };
}
