'use client';

import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutTerminalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export default function CheckoutTerminal({ children, onConfirm, isProcessing = false }: CheckoutTerminalProps) {
  return (
    <div className="w-full relative">
      <div className="relative w-full bg-[#07120b] rounded-sm overflow-hidden flex flex-col">
        {/* Terminal Content Area */}
        <div className="p-6 pt-4 space-y-6 relative">
          {children}

          {/* Action Area */}
          <div className="pt-6 flex flex-col items-center gap-4">
            <Button 
              onClick={onConfirm}
              disabled={isProcessing}
              className="w-full h-14 bg-[#A3E635] text-[#07120b] hover:bg-[#b4f346] font-black text-base tracking-[0.1em] rounded-sm transition-all active:scale-[0.98] disabled:opacity-50 relative overflow-hidden"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-bounce" />
                  PROCESSANDO...
                </span>
              ) : (
                'AUTORIZAR CANJE'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
