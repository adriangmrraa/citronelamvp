'use client';

import React, { useState } from 'react';
import { X, Info, ArrowLeft } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: string;
  authorName?: string;
  onBlockAction?: () => void;
}

const REPORT_CATEGORIES = [
  "Acoso",
  "Amenazas físicas",
  "Odio",
  "Abuso o sexualización de menores",
  "Divulga información personal",
  "Material íntimo no consentido",
  "Transacción prohibida",
  "Suplantación de identidad",
  "Contenido manipulado",
  "Infracción de derechos de autor",
  "Infracción de marca registrada",
  "Autolesión o suicidio",
  "Spam",
  "Infracción del Programa de colaboradores"
];

const CITRONELA_RULES = [
  { id: 'civil', label: "1. Mantén la cordialidad o serás expulsado de la comunidad." },
  { id: 'spam', label: "2. No se permite spam, contenido irrelevante o comercial." },
  { id: 'dox', label: "3. Prohibido el doxeo o divulgación de datos personales." },
  { id: 'custom', label: "Respuesta personalizada" }
];

type ModalStep = 'category' | 'details' | 'success';

export default function ReportModal({ isOpen, onClose, targetName, authorName = "el usuario", onBlockAction }: ReportModalProps) {
  const [step, setStep] = useState<ModalStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [shouldBlock, setShouldBlock] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 'category' && selectedCategory) setStep('details');
    else if (step === 'details' && (selectedRule || customDescription)) setStep('success');
  };

  const handleBack = () => {
    if (step === 'details') setStep('category');
  };

  const handleFinalize = () => {
    if (shouldBlock && onBlockAction) {
      onBlockAction();
    }
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // Reset state after a small delay to avoid flicker during closing animation
    setTimeout(() => {
      setStep('category');
      setSelectedCategory(null);
      setSelectedRule(null);
      setCustomDescription('');
      setShouldBlock(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-[480px] bg-[#050c07] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {step === 'details' && (
              <button onClick={handleBack} className="p-1 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Enviar una denuncia</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto no-scrollbar">
          {step === 'category' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed font-medium">
                Gracias por cuidar de ti y de tus compañeros usuarios al denunciar cosas que van contra las reglas. Cuéntanos lo que está sucediendo.
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {REPORT_CATEGORIES.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedCategory(option)}
                    className={`px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all duration-200 border ${
                      selectedCategory === option
                        ? 'bg-lime-400 border-lime-400 text-[#050c07] shadow-[0_0_20px_rgba(163,230,53,0.4)]'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextStep}
                disabled={!selectedCategory}
                className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory
                    ? 'bg-white text-black hover:bg-lime-400 shadow-xl active:scale-[0.98]'
                    : 'bg-white/5 text-zinc-600 cursor-not-allowed opacity-50'
                }`}
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-zinc-100 font-bold mb-6">Detalles de la denuncia</h3>
              
              <div className="space-y-4 mb-8">
                {CITRONELA_RULES.map((rule) => (
                  <label 
                    key={rule.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedRule === rule.id 
                        ? 'bg-lime-400/10 border-lime-400/40' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="pt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedRule === rule.id ? 'border-lime-400 bg-lime-400' : 'border-zinc-700'
                      }`}>
                        {selectedRule === rule.id && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="rule" 
                      className="hidden" 
                      checked={selectedRule === rule.id}
                      onChange={() => setSelectedRule(rule.id)}
                    />
                    <span className={`text-xs leading-relaxed ${selectedRule === rule.id ? 'text-lime-400 font-bold' : 'text-zinc-400'}`}>
                      {rule.label}
                    </span>
                  </label>
                ))}
              </div>

              {selectedRule === 'custom' && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-[#0a1a10] border border-white/10 rounded-2xl p-4">
                    <textarea 
                      placeholder="Descripción de la denuncia..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value.slice(0, 500))}
                      className="w-full bg-transparent border-none text-zinc-200 text-sm focus:ring-0 outline-none resize-none h-32 placeholder:text-zinc-600"
                    />
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-zinc-500 font-bold">Danos más detalles sobre tu reporte</span>
                      <span className="text-[10px] text-zinc-600 font-bold tracking-widest">{customDescription.length}/500</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleNextStep}
                disabled={!selectedRule}
                className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  selectedRule
                    ? 'bg-white text-black hover:bg-lime-400 shadow-xl'
                    : 'bg-white/5 text-zinc-600 cursor-not-allowed opacity-50'
                }`}
              >
                Enviar
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-lime-400/20 text-lime-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(163,230,53,0.1)]">
                  <X size={40} className="rotate-45" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tighter">Gracias por tu denuncia</h3>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-[320px] mx-auto">
                  Tus reportes ayudan a hacer de Citronela un lugar mejor, más seguro y más acogedor para todo el mundo.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-10 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                <div className="flex-1 pr-4">
                  <h4 className="text-[11px] font-black text-zinc-200 mb-1 tracking-tight">Bloquear a {authorName}</h4>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    No podrán enviarse mensajes directos ni interactuar entre ustedes.
                  </p>
                </div>
                
                <button 
                  onClick={() => setShouldBlock(!shouldBlock)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    shouldBlock ? 'bg-lime-400' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      shouldBlock ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleFinalize}
                className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                Hecho
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
