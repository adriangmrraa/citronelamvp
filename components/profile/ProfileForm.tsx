'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileData {
  id: number;
  username: string;
  email: string | null;
  role: string;
  tokens: number;
  planType: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  preferredGenetics: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  emailVerified: boolean;
}

interface ProfileFormProps {
  profile: ProfileData;
}

export default function ProfileForm({ profile }: { profile?: ProfileData }) {
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [address, setAddress] = useState(profile?.address ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [preferredGenetics, setPreferredGenetics] = useState(profile?.preferredGenetics ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, address, bio, preferredGenetics, avatarUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el perfil');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const roleLabel: Record<string, string> = {
    admin: 'Administrador',
    cultivator: 'Cultivador',
    patient: 'Paciente',
    user: 'Usuario',
  };

  const planLabel: Record<string, string> = {
    basic: 'Básico',
    premium: 'Premium',
    vip: 'VIP',
  };

  return (
    <div className="space-y-6">
      {/* Info de solo lectura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Usuario</p>
              <p className="font-medium text-zinc-100">{profile?.username || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Email</p>
              <p className="font-medium text-zinc-100">{profile?.email ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Rol</p>
              <Badge variant="secondary">
                {profile?.role ? (roleLabel[profile.role] ?? profile.role) : '—'}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Tokens</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white tracking-tighter">
                  {profile?.tokens.toLocaleString() ?? 0}
                </span>
                <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Plan</p>
              <p className="font-medium text-zinc-100">
                {profile?.planType ? (planLabel[profile.planType] ?? profile.planType) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Estado</p>
              <Badge variant={profile?.isVerified ? 'default' : 'secondary'}>
                {profile?.isVerified ? 'Verificado' : 'Pendiente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario editable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saveError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="bg-lime-400/10 border border-lime-400/20 text-lime-400 p-3 rounded-xl text-sm">
                Perfil actualizado correctamente.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-medium text-sm">
                Teléfono
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-medium text-sm">
                Dirección
              </label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tu dirección"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-medium text-sm">
                Biografía
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Contanos algo sobre vos..."
                className="flex w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-medium text-sm">
                Genética preferida
              </label>
              <Input
                type="text"
                value={preferredGenetics}
                onChange={(e) => setPreferredGenetics(e.target.value)}
                placeholder="Ej: Indica, Sativa, Híbrido"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-medium text-sm">
                URL de avatar
              </label>
              <Input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-lime-400 text-[#07120b] hover:bg-lime-300 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
