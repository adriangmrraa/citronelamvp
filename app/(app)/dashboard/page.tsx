import Link from 'next/link';
import { Sprout, FileText, ShoppingBag, Coins, Users, ArrowRight } from 'lucide-react';

const stats = [
  {
    label: 'Cultivos activos',
    value: '3',
    icon: Sprout,
    color: 'text-lime-400',
    border: 'border-l-4 border-lime-400',
  },
  {
    label: 'Registros',
    value: '12',
    icon: FileText,
    color: 'text-emerald-400',
    border: 'border-l-4 border-emerald-400',
  },
  {
    label: 'Pedidos',
    value: '5',
    icon: ShoppingBag,
    color: 'text-amber-400',
    border: 'border-l-4 border-amber-400',
  },
  {
    label: 'Tokens',
    value: '100',
    icon: Coins,
    color: 'text-cyan-400',
    border: 'border-l-4 border-cyan-400',
  },
];

const quickActions = [
  {
    title: 'Mi Cultivo',
    description: 'Gestionar cultivos',
    icon: Sprout,
    href: '/cultivo',
  },
  {
    title: 'Marketplace',
    description: 'Explorar productos',
    icon: ShoppingBag,
    href: '/market',
  },
  {
    title: 'Comunidad',
    description: 'Ver publicaciones',
    icon: Users,
    href: '/community',
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.04] animate-bg-drift bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg/hero.jpg')" }}
      />
      {/* Grid pattern */}
      <div className="fixed inset-0 -z-10 bg-grid-weed opacity-[0.03]" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome header */}
        <div>
          <p className="text-zinc-400 text-sm">Bienvenido de vuelta</p>
          <h1 className="text-3xl font-black text-white">demo</h1>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`glass-surface ${stat.border} p-5 rounded-xl flex flex-col gap-3`}
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-zinc-500 text-sm">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="glass-surface group rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:border-lime-400/25 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center group-hover:bg-lime-400/15 transition-colors">
                  <Icon className="text-lime-400 w-6 h-6" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-zinc-50">{action.title}</p>
                    <p className="text-zinc-400 text-sm">{action.description}</p>
                  </div>
                  <ArrowRight className="text-zinc-600 group-hover:text-lime-400 group-hover:translate-x-1 transition-all w-5 h-5 mt-1 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
