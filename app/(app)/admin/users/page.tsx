import UserTableWrapper from '@/components/admin/UserTableWrapper';

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/admin/users`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.users ?? [];
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Usuarios</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      <UserTableWrapper initialUsers={users} />
    </div>
  );
}
