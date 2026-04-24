'use client';

import { useState, useCallback } from 'react';
import UserTable from '@/components/admin/UserTable';

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

interface UserTableWrapperProps {
  initialUsers: User[];
}

export default function UserTableWrapper({ initialUsers }: UserTableWrapperProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Error al recargar usuarios');
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {refreshing && (
        <div className="mb-4 text-sm text-zinc-500">Actualizando...</div>
      )}
      <UserTable users={users} onRefresh={refresh} />
    </div>
  );
}
