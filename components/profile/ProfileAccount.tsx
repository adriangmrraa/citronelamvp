'use client';

import React from 'react';
import { User, FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from './ProfileForm';
import DocumentList from './DocumentList';

interface ProfileAccountProps {
  user: any;
  initialProfile: any;
  initialDocuments: any[];
}

export default function ProfileAccount({ user, initialProfile, initialDocuments }: ProfileAccountProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <User size={20} className="text-lime-400" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Datos Personales</h3>
            </div>
            <ProfileForm profile={initialProfile?.user} />
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <FileText size={20} className="text-lime-400" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Expediente Legal</h3>
            </div>
            <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Documentación & REPROCANN</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentList documents={initialDocuments} />
              </CardContent>
            </Card>
          </section>

          <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-4">
            <ShieldCheck className="text-lime-400" size={32} />
            <h4 className="font-black text-white uppercase tracking-tight">Seguridad de Cuenta</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">Tu cuenta está protegida con encriptación de grado militar Citro_OS. No compartas tus claves con nadie.</p>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-colors">
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
