import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import AdminSidebarWrapper from '@/components/layout/AdminSidebarWrapper';
import GlobalCart from '@/components/market/GlobalCart';
import { CartProvider } from '@/context/CartContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#07120b] relative overflow-hidden">
        {/* Global High-Quality Static Lava Background */}
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{
            background: `
              radial-gradient(circle at 0% 0%, rgba(163, 230, 53, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 100% 40%, rgba(163, 230, 53, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 15% 100%, rgba(163, 230, 53, 0.1) 0%, transparent 50%)
            `
          }}
        />

        {/* Cinematic Global Background */}
        <div
          className="fixed inset-0 z-0 opacity-[0.04] animate-bg-drift bg-cover bg-center grayscale contrast-125 pointer-events-none"
          style={{ backgroundImage: "url('/images/bg/hero.jpg')" }}
        />
        <div className="fixed inset-0 z-0 bg-grid-weed opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col flex-1">
          <AppHeader />
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar solo visible en rutas /admin */}
            <AdminSidebarWrapper />
            <main className="flex-1 overflow-y-auto flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <AppFooter />
            </main>
          </div>
        </div>
        <GlobalCart />
      </div>
    </CartProvider>
  );
}
