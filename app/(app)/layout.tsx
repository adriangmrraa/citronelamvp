import AppHeader from '@/components/layout/AppHeader';
import AdminSidebarWrapper from '@/components/layout/AdminSidebarWrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07120b]">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar solo visible en rutas /admin */}
        <AdminSidebarWrapper />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
