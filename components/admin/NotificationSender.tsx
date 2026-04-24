'use client';

import { useState } from 'react';
import { Send, Users, User } from 'lucide-react';

type Mode = 'single' | 'broadcast';
type BroadcastTarget = 'all' | 'verified' | 'cultivators' | 'admins';

const BROADCAST_TARGETS: { value: BroadcastTarget; label: string }[] = [
  { value: 'all', label: 'Todos los usuarios' },
  { value: 'verified', label: 'Verificados' },
  { value: 'cultivators', label: 'Cultivadores' },
  { value: 'admins', label: 'Administradores' },
];

export default function NotificationSender() {
  const [mode, setMode] = useState<Mode>('single');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<BroadcastTarget>('all');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      if (mode === 'single') {
        if (!userId.trim()) {
          setFeedback({ type: 'error', text: 'Ingresá el ID del usuario' });
          return;
        }
        const res = await fetch('/api/admin/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(userId), message: message.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al enviar');
        setFeedback({ type: 'success', text: 'Notificación enviada correctamente' });
      } else {
        const res = await fetch('/api/admin/notifications/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target, message: message.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al enviar');
        setFeedback({
          type: 'success',
          text: `Broadcast enviado a ${data.count ?? 0} usuario${data.count !== 1 ? 's' : ''}`,
        });
      }

      setMessage('');
      setUserId('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al enviar la notificación',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Enviar notificación</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Enviá mensajes directos o broadcasts a grupos de usuarios
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'single'
              ? 'bg-white/[0.08] text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-4 h-4" />
          A un usuario
        </button>
        <button
          type="button"
          onClick={() => setMode('broadcast')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'broadcast'
              ? 'bg-white/[0.08] text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Broadcast
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'single' ? (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              ID de usuario
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ej: 42"
              min={1}
              className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent transition"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Destinatarios
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as BroadcastTarget)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent transition"
            >
              {BROADCAST_TARGETS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Mensaje
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribí el mensaje de la notificación..."
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent transition resize-none"
          />
          <p className="text-xs text-zinc-500 mt-1 text-right">
            {message.length}/500
          </p>
        </div>

        {feedback && (
          <div
            className={`px-4 py-3 rounded-xl text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-lime-400/10 text-lime-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="flex items-center gap-2 bg-lime-400 text-[#07120b] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Enviando...' : mode === 'broadcast' ? 'Enviar broadcast' : 'Enviar notificación'}
        </button>
      </form>
    </div>
  );
}
