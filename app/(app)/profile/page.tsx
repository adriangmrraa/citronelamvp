import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/profile/ProfileForm';
import DocumentList from '@/components/profile/DocumentList';

async function getProfile() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/profile`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function getDocuments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/profile/documents`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.documents ?? [];
}

export default async function ProfilePage() {
  const [profile, documents] = await Promise.all([getProfile(), getDocuments()]);

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-red-600 dark:text-red-400">
          No se pudo cargar el perfil. Por favor, iniciá sesión nuevamente.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mi Perfil</h1>

      <ProfileForm profile={profile} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expediente Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList documents={documents} />
        </CardContent>
      </Card>
    </div>
  );
}
