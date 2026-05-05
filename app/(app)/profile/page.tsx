"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ProfileRibbon } from "@/components/features/profile/ProfileRibbon";
import { SettingsNav } from "@/components/features/profile/SettingsNav";
import { ActivityFeed } from "@/components/features/profile/ActivityFeed";
import { SettingsGrid } from "@/components/features/profile/SettingsGrid";
import { WalletModule } from "@/components/features/profile/WalletModule";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@/context/SearchContext";
import { useUserContext } from "@/context/UserContext";

// Imports de subpestañas específicas
import { SettingsAccount } from '@/components/features/profile/SettingsAccount';
import { SettingsProfile } from '@/components/features/profile/SettingsProfile';
import { SettingsPrivacy } from '@/components/features/profile/SettingsPrivacy';
import { SettingsPreferences } from '@/components/features/profile/SettingsPreferences';
import { SettingsEmail } from '@/components/features/profile/SettingsEmail';
import { SettingsNotifications } from '@/components/features/profile/SettingsNotifications';

import { Sprout, ShoppingCart, MessageSquare, PartyPopper } from "lucide-react";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "stats";
  const initialSubTab = searchParams.get("subtab") || "cuenta";

  const {
    transactions,
    stats,
    settings,
    updateSettings,
    isLoading: profileLoading,
  } = useProfile();
  
  const {
    username,
    tokens,
    transactions: contextTransactions,
    stats: contextStats,
  } = useUserContext();
  const { searchTerm } = useSearch();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  // Sync state if params change
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);

    const sub = searchParams.get("subtab");
    if (sub) setActiveSubTab(sub);
  }, [searchParams]);

  // Use context data as primary source
  const displayTransactions =
    contextTransactions.length > 0 ? contextTransactions : [];

  const filteredActivity = displayTransactions.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="bg-[#A3E635] pt-3 pb-8 px-6 md:px-12">
          <Skeleton className="h-10 w-48 bg-[#07120b]/20" />
        </div>
        <div className="px-6 md:px-12 py-12 space-y-12">
          <Skeleton className="h-64 w-full rounded-[2rem] bg-zinc-900" />
        </div>
      </div>
    );
  }

  const renderSettingsContent = () => {
    switch (activeSubTab) {
      case 'cuenta': return <SettingsAccount />;
      case 'perfil': return <SettingsProfile />;
      case 'privacidad': return <SettingsPrivacy />;
      case 'preferencias': return <SettingsPreferences />;
      case 'correo': return <SettingsEmail />;
      case 'notificaciones': return <SettingsNotifications />;
      default: return <SettingsGrid settings={settings} onUpdate={updateSettings} />;
    }
  };

  return (
    <div className="min-h-screen text-zinc-200 pb-24 font-sans">
      <div className="relative z-20">
        <div className="bg-[#A3E635] pt-3 pb-0 px-6 md:px-12 border-b border-[#07120b]/10">
          <div className="max-w-[2000px] mx-auto space-y-2">
            <ProfileHeader />
            <ProfileRibbon activeTab={activeTab} onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'settings') setActiveSubTab('cuenta');
            }} />
          </div>
        </div>
      </div>

      <main className="px-6 md:px-12 pt-6 relative z-10 max-w-[2000px] mx-auto">
        {activeTab === "activity" && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ActivityFeed activities={filteredActivity} />
          </section>
        )}

        {activeTab === "settings" && (
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SettingsNav
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
            <div className="w-full">
              {renderSettingsContent()}
            </div>
          </section>
        )}

        {activeTab === "stats" && (
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
              {/* Cultivo KPI */}
              <div className="p-8 bg-zinc-900/20 border-b border-white/10 sm:border-r border-white/10 flex flex-col gap-6 group hover:bg-zinc-900/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-[#A3E635]/10 flex items-center justify-center shrink-0">
                    <Sprout className="w-6 h-6 text-[#A3E635]" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Mi Cultivo
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white leading-none">
                    {contextStats.crops}{" "}
                    <span className="text-sm text-zinc-500 font-medium">
                      Parcelas
                    </span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">
                    Estado: Óptimo
                  </p>
                </div>
              </div>

              {/* Market KPI */}
              <div className="p-8 bg-zinc-900/20 border-b border-white/10 lg:border-r border-white/10 flex flex-col gap-6 group hover:bg-zinc-900/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-amber-400/10 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Market
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white leading-none">
                    {contextStats.purchases}{" "}
                    <span className="text-sm text-zinc-500 font-medium">
                      Pedidos
                    </span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">
                    Nivel: Comprador Fiel
                  </p>
                </div>
              </div>

              {/* Foro KPI */}
              <div className="p-8 bg-zinc-900/20 border-b border-white/10 sm:border-r border-white/10 flex flex-col gap-6 group hover:bg-zinc-900/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-400/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Foro
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white leading-none">
                    {contextStats.posts}{" "}
                    <span className="text-sm text-zinc-500 font-medium">
                      Aportes
                    </span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">
                    Reputación: +450
                  </p>
                </div>
              </div>

              {/* Eventos KPI */}
              <div className="p-8 bg-zinc-900/20 border-b border-white/10 flex flex-col gap-6 group hover:bg-zinc-900/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-purple-400/10 flex items-center justify-center shrink-0">
                    <PartyPopper className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Eventos
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white leading-none">
                    {contextStats.events}{" "}
                    <span className="text-sm text-zinc-500 font-medium">
                      Vistos
                    </span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">
                    Próximo: Expo 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Health Meter */}
            <div className="p-8 bg-[#A3E635]/5 border border-[#A3E635]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Salud General del Ecosistema
                </h3>
                <p className="text-sm text-zinc-500">
                  Métrica basada en tu actividad semanal
                </p>
              </div>
              <div className="flex items-end gap-1 w-full sm:w-auto h-12">
                {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 sm:w-2 ${h === 100 ? "bg-[#A3E635]" : "bg-zinc-800"}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "wallet" && (
          <WalletModule
            tokens={tokens}
            activities={displayTransactions}
            initialSubTab={activeSubTab as "buy" | "history"}
          />
        )}
      </main>
    </div>
  );
}
