'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TokenAssignModal from '@/components/admin/TokenAssignModal';

interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
  tokens: number;
  isVerified: boolean;
  emailVerified: boolean;
  planType: string | null;
  isCultivator: boolean;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

type FilterTab = 'todos' | 'pendientes' | 'verificados';

export default function UserTable({ users, onRefresh }: UserTableProps) {
  const [filter, setFilter] = useState<FilterTab>('todos');
  const [tokenModalUser, setTokenModalUser] = useState<User | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filtered = users
    .filter((u) => {
      if (filter === 'pendientes') return !u.isVerified;
      if (filter === 'verificados') return u.isVerified;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAction = async (userId: number, action: 'approve' | 'reject' | 'toggle-cultivator') => {
    const key = `${action}-${userId}`;
    setLoadingAction(key);

    try {
      let url = '';
      let method = 'PUT';

      if (action === 'approve') url = `/api/admin/users/${userId}/approve`;
      else if (action === 'reject') url = `/api/admin/users/${userId}/reject`;
      else if (action === 'toggle-cultivator') url = `/api/admin/users/${userId}/cultivator`;

      const res = await fetch(url, { method });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al realizar la acción');
      }

      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingAction(null);
    }
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendientes', label: 'Pendientes' },
    { key: 'verificados', label: 'Verificados' },
  ];

  const planLabel: Record<string, string> = {
    basic: 'Básico',
    premium: 'Premium',
    vip: 'VIP',
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-lime-400 text-[#07120b]'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.06]'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
              filter === tab.key ? 'bg-lime-500/40' : 'bg-white/[0.08]'
            }`}>
              {tab.key === 'todos'
                ? users.length
                : tab.key === 'pendientes'
                ? users.filter((u) => !u.isVerified).length
                : users.filter((u) => u.isVerified).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-center py-10 text-zinc-500 text-sm">
          No hay usuarios en esta categoría.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.04] text-left">
                <th className="px-4 py-3 font-semibold text-zinc-400">Usuario</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Email</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Rol</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Tokens</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Plan</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Estado</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-zinc-100">{user.username}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {user.email ?? '—'}
                    {user.emailVerified && (
                      <span className="ml-1 text-lime-400" title="Email verificado">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{user.role}</Badge>
                    {user.isCultivator && (
                      <Badge variant="default" className="ml-1 text-xs">Cultivador</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-white tracking-tighter">
                        {user.tokens.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {user.planType ? planLabel[user.planType] ?? user.planType : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {user.isVerified ? (
                      <Badge variant="default">Verificado</Badge>
                    ) : user.emailVerified ? (
                      <Badge variant="secondary" className="bg-amber-400/20 text-amber-400 border-amber-400/30">
                        Email OK
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {!user.isVerified && user.emailVerified && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(user.id, 'approve')}
                          disabled={loadingAction === `approve-${user.id}`}
                        >
                          {loadingAction === `approve-${user.id}` ? '...' : 'Aprobar'}
                        </Button>
                      )}
                      {!user.isVerified && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(user.id, 'reject')}
                          disabled={loadingAction === `reject-${user.id}`}
                        >
                          {loadingAction === `reject-${user.id}` ? '...' : 'Rechazar'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTokenModalUser(user)}
                      >
                        Tokens
                      </Button>
                      <Button
                        size="sm"
                        variant={user.isCultivator ? 'secondary' : 'outline'}
                        onClick={() => handleAction(user.id, 'toggle-cultivator')}
                        disabled={loadingAction === `toggle-cultivator-${user.id}`}
                      >
                        {user.isCultivator ? 'Quitar cultivador' : 'Cultivador'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tokenModalUser && (
        <TokenAssignModal
          userId={tokenModalUser.id}
          username={tokenModalUser.username}
          onClose={() => setTokenModalUser(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}
