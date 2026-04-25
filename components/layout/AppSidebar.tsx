'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Sprout,
  MessageSquare,
  Receipt,
  CalendarDays,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/cultivo', label: 'Parcelas', icon: Sprout },
  { href: '/admin/community', label: 'Comunidad', icon: MessageSquare },
  { href: '/admin/transactions', label: 'Transacciones', icon: Receipt },
  { href: '/admin/events', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/legal', label: 'Legal', icon: FileText },
  { href: '/admin/notifications', label: 'Notificaciones', icon: Bell },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  const navContent = (
    <nav className="flex-1 py-4 space-y-0.5 px-2">
      {SIDEBAR_LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors group ${
              active
                ? 'bg-lime-400/[0.08] text-lime-400 border-l-2 border-lime-400/60 rounded-r-xl'
                : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 rounded-xl'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 rounded-xl bg-lime-400 text-[#07120b] flex items-center justify-center shadow-lg shadow-lime-400/20"
        aria-label="Abrir menú admin"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#07120b]/95 backdrop-blur-xl border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <span className="text-sm font-semibold text-zinc-300">Admin Panel</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-[#07120b]/90 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="flex justify-end p-3 border-b border-white/[0.06]">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-500 transition-colors"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
