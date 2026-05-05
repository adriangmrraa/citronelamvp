"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'purchase' | 'token_buy' | 'token_earn' | 'event' | 'post';
  title: string;
  amount: string;
  date: string;
  description?: string;
  tokensValue: number;
  productId?: string; // For single purchases
  productIds?: string[]; // For cart purchases
  eventId?: string; // For event reservations
}

interface UserStats {
  posts: number;
  purchases: number;
  events: number;
  crops: number;
}

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  tokens: number;
  setTokens: (amount: number) => void;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_initial_100k',
    type: 'token_earn',
    title: 'Bono de Bienvenida',
    amount: '+100.000 TOKENS',
    date: '2026-05-01',
    description: 'Crédito inicial de cortesía',
    tokensValue: 100000
  },
  {
    id: 'tx_evt_1',
    type: 'event',
    title: 'Reserva evento: Expo Cannabis 2026',
    amount: '-500 TOKENS',
    date: '2026-05-02',
    description: 'Reserva de evento',
    tokensValue: -500,
    eventId: '1'
  },
  {
    id: 'tx_evt_2',
    type: 'event',
    title: 'Reserva evento: Workshop Hidroponia',
    amount: '-300 TOKENS',
    date: '2026-05-03',
    description: 'Reserva de evento',
    tokensValue: -300,
    eventId: '2'
  },
  {
    id: 'tx_evt_3',
    type: 'event',
    title: 'Reserva evento: Conferencia Genética',
    amount: '-450 TOKENS',
    date: '2026-05-04',
    description: 'Reserva de evento',
    tokensValue: -450,
    eventId: '3'
  }
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>('CitroUser');
  const [tokens, setTokens] = useState<number>(100000);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [stats, setStats] = useState<UserStats>({
    posts: 12,
    purchases: 0, // Will be calculated
    events: 2,
    crops: 7
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to calculate unique events
  const calculateUniqueEvents = (txs: Transaction[]) => {
    const uniqueEvents = new Set<string>();
    txs.forEach(tx => {
      const isEvent = tx.type === 'event' || tx.eventId || tx.title.startsWith('Reserva evento:');
      if (isEvent) {
        if (tx.eventId) uniqueEvents.add(tx.eventId);
        else uniqueEvents.add(tx.title);
      }
    });
    return uniqueEvents.size;
  };

  // Helper to calculate unique purchases
  const calculateUniquePurchases = (txs: Transaction[]) => {
    const uniqueProducts = new Set<string>();
    txs.forEach(tx => {
      if (tx.type === 'purchase') {
        if (tx.productId) uniqueProducts.add(tx.productId);
        if (tx.productIds) tx.productIds.forEach(id => uniqueProducts.add(id));
        // Fallback to title if no ID provided (for legacy compatibility)
        if (!tx.productId && !tx.productIds) uniqueProducts.add(tx.title);
      }
    });
    return uniqueProducts.size;
  };

  // Cargar datos al iniciar
  useEffect(() => {
    const savedName = localStorage.getItem('citro_user_name');
    const savedTokens = localStorage.getItem('citro_user_tokens');
    const savedStatus = localStorage.getItem('citro_user_logged');
    const savedTx = localStorage.getItem('citro_user_transactions');
    const savedStats = localStorage.getItem('citro_user_stats');

    if (savedName) setUsername(savedName);
    if (savedTokens) setTokens(parseInt(savedTokens));
    if (savedStatus === 'true') setIsLoggedIn(true);
    
    let loadedTxs = INITIAL_TRANSACTIONS;
    if (savedTx) {
      let parsed = JSON.parse(savedTx);
      parsed = parsed.map((tx: Transaction) => {
        if (tx.id === 'tx_initial_100k' || tx.title === 'Adquisición de Tokens') {
          return { ...tx, title: 'Bono de Bienvenida', description: 'Crédito inicial de cortesía' };
        }
        return tx;
      });
      if (parsed.length > 0) loadedTxs = parsed;
    }
    setTransactions(loadedTxs);

    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      setStats({
        ...parsedStats,
        purchases: calculateUniquePurchases(loadedTxs),
        events: calculateUniqueEvents(loadedTxs)
      });
    } else {
      setStats(prev => ({ 
        ...prev, 
        purchases: calculateUniquePurchases(loadedTxs),
        events: calculateUniqueEvents(loadedTxs)
      }));
    }
    
    setIsLoaded(true);
  }, []);

  // Persistir datos ante cambios
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('citro_user_name', username);
      localStorage.setItem('citro_user_tokens', tokens.toString());
      localStorage.setItem('citro_user_logged', isLoggedIn.toString());
      localStorage.setItem('citro_user_transactions', JSON.stringify(transactions));
      
      const currentStats = {
        ...stats,
        purchases: calculateUniquePurchases(transactions),
        events: calculateUniqueEvents(transactions)
      };
      localStorage.setItem('citro_user_stats', JSON.stringify(currentStats));
    }
  }, [username, tokens, isLoggedIn, transactions, stats, isLoaded]);

  const login = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('CitroUser');
    localStorage.removeItem('citro_user_logged');
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    const newTransactions = [newTx, ...transactions];
    setTransactions(newTransactions);
    
    // Update stats with dynamic counts
    setStats(prev => ({
      ...prev,
      purchases: calculateUniquePurchases(newTransactions),
      events: calculateUniqueEvents(newTransactions)
    }));
    
    // Update tokens
    setTokens(prev => prev + tx.tokensValue);
  };

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
      tokens,
      setTokens,
      isLoggedIn,
      login,
      logout,
      transactions,
      addTransaction,
      stats,
      updateStats
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
