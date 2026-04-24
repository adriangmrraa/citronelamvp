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

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-[#07120b]/90 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Collapse toggle */}
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

      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {SIDEBAR_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors group ${
                active
                  ? 'bg-lime-400/[0.08] text-lime-400 border-l-2 border-lime-400/60 rounded-r-xl'
                  : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 rounded-xl'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
