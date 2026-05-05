'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { avigea } from '@/lib/fonts';
import { useUserContext } from '@/context/UserContext';
import { Lock, User, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserContext();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de delay de red para efecto premium
    setTimeout(() => {
      login(identifier || 'Usuario Citronela');
      router.push('/cultivo'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07120b] flex items-start justify-center p-6 pt-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-lime-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full" />
      
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        {/* Header - Bienvenido a Citronela */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-[10px] font-black text-lime-400 uppercase tracking-[0.4em] mb-2">Bienvenido a</p>
          <Link href="/" className="flex items-center gap-1">
            <span className={`${avigea.className} text-5xl font-normal tracking-wide`}>
              <span className="text-lime-400">Citro</span><span className="text-white">nela</span>
            </span>
          </Link>
        </div>

        {/* Login Area - No Card, Minimalist */}
        <div className="p-2">

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Usuario o Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-lime-400 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Tu alias o correo"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-none py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-lime-400/50 focus:bg-white/[0.05] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-lime-400 transition-colors">
                  <Shield size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-none py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-lime-400/50 focus:bg-white/[0.05] transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded-none border-white/10 bg-white/5 checked:bg-lime-400 checked:border-lime-400 transition-all cursor-pointer"
                />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Recordar sesión</span>
              </label>
              <Link href="/forgot-password" size={10} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-lime-400 transition-colors">
                Olvidé mi clave
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-400 text-[#07120b] py-5 rounded-none font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#07120b] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al Sistema
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 flex justify-center">
            <Link href="/register" className="text-zinc-600 hover:text-lime-400 text-xs font-black uppercase tracking-widest transition-colors border-b border-white/5 pb-1">
              No tengo cuenta
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex justify-center items-center gap-6 text-zinc-800">
          <div className="flex items-center gap-2">
            <Lock size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Cifrado de Alta Seguridad</span>
          </div>
        </div>
      </div>
    </div>
  );
}
