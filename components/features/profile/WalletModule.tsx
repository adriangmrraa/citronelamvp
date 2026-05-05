'use client';

import React, { useState } from 'react';
import { ActivityFeed } from './ActivityFeed';
import { ProfileActivity } from '@/types/profile';
import { Coins, CreditCard, Wallet as WalletIcon, Receipt, Ticket, CheckCircle, Smartphone } from 'lucide-react';

interface WalletModuleProps {
  tokens: number;
  activities: ProfileActivity[];
  initialSubTab?: 'buy' | 'history';
}

const PAYMENT_METHODS = [
  { id: 'mp', name: 'Mercado Pago', icon: Smartphone, color: 'text-blue-400' },
  { id: 'stripe', name: 'Stripe (SaaS)', icon: CreditCard, color: 'text-indigo-400' },
  { id: 'paypal', name: 'PayPal', icon: WalletIcon, color: 'text-blue-500' },
  { id: 'pagofacil', name: 'Pago Fácil', icon: Receipt, color: 'text-yellow-500' },
  { id: 'rapipago', name: 'Rapipago', icon: Ticket, color: 'text-blue-600' },
];

const PACKS = [
  { amount: 100, price: '10.000', currency: 'ARS' },
  { amount: 500, price: '50.000', currency: 'ARS', popular: true },
  { amount: 1000, price: '90.000', currency: 'ARS', discount: '10% OFF' },
];

export function WalletModule({ tokens, activities, initialSubTab = 'buy' }: WalletModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'buy' | 'history'>(initialSubTab);
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = () => {
    if (!selectedPack || !selectedMethod) return;
    
    setIsProcessing(true);
    // Simulación de proceso de pago
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Internal Navigation */}
      <div className="flex items-center justify-center gap-8 border-b border-white/5 pb-4">
        <button 
          onClick={() => setActiveSubTab('buy')}
          className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeSubTab === 'buy' ? 'text-[#A3E635]' : 'text-zinc-500 hover:text-white'}`}
        >
          Adquirir Tokens
        </button>
        <button 
          onClick={() => setActiveSubTab('history')}
          className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeSubTab === 'history' ? 'text-[#A3E635]' : 'text-zinc-500 hover:text-white'}`}
        >
          Historial
        </button>
      </div>

      {activeSubTab === 'buy' ? (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
          {/* Saldo Header - Moved here */}
          <div className="py-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#A3E635]/10 flex items-center justify-center border border-[#A3E635]/20">
                <Coins className="text-[#A3E635] w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none flex items-baseline justify-center gap-3 whitespace-nowrap">
                  {tokens.toLocaleString()} <span className="text-[#A3E635] text-xl md:text-4xl">TOKENS</span>
                </p>
                <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-4 md:mt-6">
                  Saldo Total Disponible
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pack Selection */}
          <div className="space-y-6">
            <h3 style={{ fontFamily: 'var(--font-avigea)' }} className="text-2xl text-white border-b border-white/10 pb-4">1. Seleccionar Pack</h3>
            <div className="divide-y divide-white/5">
              {PACKS.map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => setSelectedPack(pack.amount)}
                  className={`w-full py-6 transition-all flex items-center justify-between group relative ${
                    selectedPack === pack.amount ? 'text-[#A3E635]' : 'text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedPack === pack.amount ? 'bg-[#A3E635] text-black' : 'bg-white/5 text-[#A3E635]'}`}>
                      <Coins className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="flex flex-col gap-1">
                        {pack.popular && <span className="w-fit text-[8px] font-black bg-[#A3E635] text-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Más Popular</span>}
                        {pack.discount && <span className="w-fit text-[8px] font-black bg-[#A3E635] text-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">{pack.discount}</span>}
                        <p className="font-black whitespace-nowrap">
                          {pack.amount.toLocaleString()} <span className={`${selectedPack === pack.amount ? 'text-black bg-[#A3E635] px-1 text-[8px]' : 'text-[#A3E635] text-[9px]'} ml-1`}>TOKENS</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-xl font-black">
                      ${pack.price} <span className="text-[10px] text-zinc-500 ml-1">ARS</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6">
            <h3 style={{ fontFamily: 'var(--font-avigea)' }} className="text-2xl text-white border-b border-white/10 pb-4">2. Método de Pago</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`py-4 px-2 transition-all flex flex-col items-center gap-2 group relative ${
                      selectedMethod === method.id 
                      ? 'text-[#A3E635]' 
                      : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-[#A3E635]' : method.color}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center">{method.name}</span>
                    {selectedMethod === method.id && (
                      <div className="absolute bottom-0 w-8 h-1 bg-[#A3E635] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              disabled={!selectedPack || !selectedMethod || isProcessing}
              onClick={handlePurchase}
              className={`w-full py-6 font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                selectedPack && selectedMethod && !isProcessing
                ? 'bg-[#A3E635] text-black hover:bg-white active:scale-[0.98]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Procesando...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  ¡Carga Exitosa!
                </>
              ) : (
                'Confirmar Compra'
              )}
            </button>
          </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <ActivityFeed 
            variant="minimal"
            activities={activities} 
          />
        </div>
      )}
    </div>
  );
}
