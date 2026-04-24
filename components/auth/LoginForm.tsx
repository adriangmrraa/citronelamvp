'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-surface rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-lime-400 font-black">
          Iniciar Sesión
        </CardTitle>
        <CardDescription>
          Ingresá tus credenciales para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verified && (
          <div className="mb-4 bg-lime-400/[0.08] border border-lime-400/25 rounded-xl p-3 text-lime-400 text-sm">
            Email verificado correctamente. Podés iniciar sesión.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/[0.08] border border-red-500/25 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Usuario
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Contraseña
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          No tenés cuenta?{' '}
          <Link href="/register" className="text-lime-400 hover:text-lime-300">
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
