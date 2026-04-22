'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from './AppSidebar';

export default function AdminSidebarWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (!isAdmin) return null;
  return <AppSidebar />;
}
