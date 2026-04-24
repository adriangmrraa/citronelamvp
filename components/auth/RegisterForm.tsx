'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="glass-surface rounded-2xl">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-50">
            Registración exitosa!
          </h2>
          <p className="text-zinc-400">
            Verificá tu email para activar tu cuenta. Una vez verificado, un administrador aprobará tu acceso.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-2">
              Ir al login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-surface rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-lime-400 font-black">
          Crear Cuenta
        </CardTitle>
        <CardDescription>
          Completá el formulario para registrarte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/[0.08] border border-red-500/25 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Usuario <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Mínimo 3 caracteres"
              required
              minLength={3}
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com (opcional)"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Ya tenés cuenta?{' '}
          <Link href="/login" className="text-lime-400 hover:text-lime-300">
            Iniciá sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
