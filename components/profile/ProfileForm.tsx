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

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [address, setAddress] = useState(profile.address ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [preferredGenetics, setPreferredGenetics] = useState(profile.preferredGenetics ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '');
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
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Usuario</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{profile.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{profile.email ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rol</p>
              <Badge variant="secondary">
                {roleLabel[profile.role] ?? profile.role}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Tokens</p>
              <p className="font-bold text-green-600 dark:text-green-400">{profile.tokens}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Plan</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {profile.planType ? planLabel[profile.planType] ?? profile.planType : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Estado</p>
              <Badge variant={profile.isVerified ? 'default' : 'secondary'}>
                {profile.isVerified ? 'Verificado' : 'Pendiente'}
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
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                Perfil actualizado correctamente.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Biografía
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Contanos algo sobre vos..."
                className="flex w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL de avatar
              </label>
              <Input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
