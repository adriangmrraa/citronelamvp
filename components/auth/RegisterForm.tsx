'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { avigea } from '@/lib/fonts';
import { Calendar, Upload, FileCheck, ShieldAlert, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

import { useUserContext } from '@/context/UserContext';

export default function RegisterForm() {
  const { setUsername: setGlobalUsername } = useUserContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [openDropdown, setOpenDropdown] = useState<'day' | 'month' | 'year' | null>(null);
  const [ageError, setAgeError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [reprocannFile, setReprocannFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const years = Array.from({ length: 2026 - 1930 + 1 }, (_, i) => 2026 - i);

  const checkAge = () => {
    if (!day || !month || !year) return false;
    
    const birthDateObj = new Date(parseInt(year), months.indexOf(month), parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pass)) return 'Debe incluir al menos una MAYÚSCULA';
    if (!/[a-z]/.test(pass)) return 'Debe incluir al menos una minúscula';
    return '';
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setReprocannFile(files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReprocannFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError(false);
    setPassError('');

    if (!username || !email || !password || !day || !month || !year) {
      setPassError('Por favor completá todos los campos');
      return;
    }

    if (!reprocannFile) {
      setPassError('Debes cargar tu credencial de REPROCANN para continuar');
      return;
    }

    if (!checkAge()) {
      setAgeError(true);
      return;
    }

    const complexityError = validatePassword(password);
    if (complexityError) {
      setPassError(complexityError);
      return;
    }

    if (password !== confirmPassword) {
      setPassError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    // Simulación de proceso de registro
    setTimeout(() => {
      setGlobalUsername(username);
      setLoading(false);
      setSuccess(true);
    }, 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#07120b] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-lime-400/10 blur-[120px] rounded-full" />
        
        <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in duration-700 text-center">
            <div className="w-24 h-24 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-lime-400/20 rounded-full animate-ping" />
              <FileCheck size={48} className="text-lime-400 relative z-10" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic mb-4">
              Hola <span className="text-lime-400">{username}</span>, Validación en Curso
            </h2>
            
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Tu solicitud y documentación de <span className="text-white font-bold italic">REPROCANN</span> han sido recibidas. 
              El equipo de <span className="text-lime-400 font-black">Citro</span><span className="text-white font-black">nela</span> está revisando tu perfil para habilitar el acceso total.
            </p>

            <div className="bg-white/5 rounded-none p-6 mb-8 flex items-start gap-4 text-left border border-white/5 backdrop-blur-md">
              <ShieldAlert className="text-amber-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Estado: Pendiente</p>
                <p className="text-[11px] text-zinc-500 font-medium">Recibirás una notificación por email una vez que tu cuenta sea autorizada (24/48hs).</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <button className="w-full bg-lime-400 text-[#07120b] py-5 rounded-none font-black uppercase tracking-[0.2em] hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 group">
                  Saltar a Login (Demo)
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <Link href="/">
                <button className="w-full bg-white/5 text-white py-4 rounded-none font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/10 text-xs">
                  Volver al Inicio
                </button>
              </Link>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07120b] flex items-start justify-center p-6 pt-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-lime-400/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-xl z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-2">
          <Link href="/" className="flex items-center gap-1 mb-1">
            <span className={`${avigea.className} text-5xl font-normal tracking-wide`}>
              <span className="text-lime-400">Citro</span><span className="text-white">nela</span>
            </span>
          </Link>
        </div>

        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Nombre de Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-none py-4 px-6 text-white focus:outline-none focus:border-lime-400/50 transition-all"
                placeholder="Tu apodo en el club"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Fecha de Nacimiento (Día / Mes / Año)</label>
              <div className="grid grid-cols-3 gap-2 h-[56px]">
                {/* Día */}
                <div className="relative h-full">
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'day' ? null : 'day')}
                    className="h-full bg-white/[0.03] border border-white/10 rounded-none flex items-center justify-between px-4 cursor-pointer hover:border-white/20 transition-all"
                  >
                    <span className={day ? 'text-white' : 'text-zinc-600'}>{day || 'Día'}</span>
                    <svg className={`w-4 h-4 text-zinc-600 transition-transform ${openDropdown === 'day' ? 'rotate-180 text-lime-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {openDropdown === 'day' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1a12] border border-white/10 rounded-none overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {days.map(d => (
                          <div 
                            key={d} 
                            onClick={() => { setDay(d.toString()); setOpenDropdown(null); }}
                            className="px-4 py-3 text-sm text-zinc-400 hover:bg-lime-400 hover:text-[#07120b] cursor-pointer transition-colors"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mes */}
                <div className="relative h-full">
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
                    className="h-full bg-white/[0.03] border border-white/10 rounded-none flex items-center justify-between px-4 cursor-pointer hover:border-white/20 transition-all"
                  >
                    <span className={month ? 'text-white' : 'text-zinc-600'}>{month || 'Mes'}</span>
                    <svg className={`w-4 h-4 text-zinc-600 transition-transform ${openDropdown === 'month' ? 'rotate-180 text-lime-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {openDropdown === 'month' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1a12] border border-white/10 rounded-none overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {months.map(m => (
                          <div 
                            key={m} 
                            onClick={() => { setMonth(m); setOpenDropdown(null); }}
                            className="px-4 py-3 text-sm text-zinc-400 hover:bg-lime-400 hover:text-[#07120b] cursor-pointer transition-colors"
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Año */}
                <div className="relative h-full">
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                    className="h-full bg-white/[0.03] border border-white/10 rounded-none flex items-center justify-between px-4 cursor-pointer hover:border-white/20 transition-all"
                  >
                    <span className={year ? 'text-white' : 'text-zinc-600'}>{year || 'Año'}</span>
                    <svg className={`w-4 h-4 text-zinc-600 transition-transform ${openDropdown === 'year' ? 'rotate-180 text-lime-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {openDropdown === 'year' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1a12] border border-white/10 rounded-none overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {years.map(y => (
                          <div 
                            key={y} 
                            onClick={() => { setYear(y.toString()); setOpenDropdown(null); }}
                            className="px-4 py-3 text-sm text-zinc-400 hover:bg-lime-400 hover:text-[#07120b] cursor-pointer transition-colors"
                          >
                            {y}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {ageError && (
                <div className="flex items-center gap-2 mt-2 ml-4 text-amber-400">
                  <ShieldAlert size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Debes ser mayor de 18 años para registrarte</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Email de Contacto</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-none py-4 px-6 text-white focus:outline-none focus:border-lime-400/50 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Contraseña Maestra</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white/[0.03] border rounded-none py-4 px-6 text-white focus:outline-none transition-all ${passError ? 'border-amber-400/50 focus:border-amber-400' : 'border-white/10 focus:border-lime-400/50'}`}
                  placeholder="Min. 8 chars (A/a)"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Repetir Contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-white/[0.03] border rounded-none py-4 px-6 text-white focus:outline-none transition-all ${passError ? 'border-amber-400/50 focus:border-amber-400' : 'border-white/10 focus:border-lime-400/50'}`}
                  placeholder="Confirmá tu clave"
                  required
                />
              </div>
            </div>
            {passError && (
              <div className="flex items-center gap-2 mt-1 ml-4 text-amber-400">
                <ShieldAlert size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">{passError}</p>
              </div>
            )}

            {/* Drag & Drop Area */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Documentación REPROCANN (PDF/JPG)</label>
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative border-2 border-dashed rounded-none p-8 flex flex-col items-center justify-center transition-all duration-300 ${
                  isDragging ? 'border-lime-400 bg-lime-400/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className={`w-14 h-14 rounded-none flex items-center justify-center mb-4 ${reprocannFile ? 'bg-lime-400 text-[#07120b]' : 'bg-white/5 text-zinc-500'}`}>
                  {reprocannFile ? <CheckCircle2 size={28} /> : <Upload size={28} />}
                </div>
                {reprocannFile ? (
                  <div className="text-center">
                    <p className="text-white text-xs font-bold truncate max-w-[200px]">{reprocannFile.name}</p>
                    <p className="text-[10px] text-lime-400 font-black uppercase mt-1">Archivo cargado con éxito</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white text-xs font-bold mb-1">Arrastrá tu documento o hace click</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Tamaño máximo: 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 text-[#07120b] py-5 rounded-none font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#07120b] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Solicitar Acceso
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex justify-center">
            <Link href="/login" className="text-zinc-500 hover:text-lime-400 text-xs font-black uppercase tracking-widest transition-colors border-b border-white/5 pb-1">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
