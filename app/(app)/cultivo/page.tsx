"use client";

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/features/dashboard/DashboardHeader';
import { CropCard } from '@/components/features/dashboard/CropCard';
import { GrowthChart } from '@/components/features/dashboard/GrowthChart';
import { MarketTeaser } from '@/components/features/dashboard/MarketTeaser';
import { SystemLog } from '@/components/features/dashboard/SystemLog';
import { ExpandCropCard } from '@/components/features/dashboard/ExpandCropCard';
import { CultivoCarousel } from '@/components/features/cultivo/CultivoCarousel';
import { CultivoHeader } from '@/components/features/cultivo/CultivoHeader';

const activeCrops = [
  // ... (keeping the same data)
  {
    batch: '042',
    name: 'Amnesia Haze',
    ph: 6.2,
    ec: 1.8,
    currentDay: 45,
    totalDays: 70,
    icon: 'potted_plant',
    camUrl: '/images/dashboard/2.png',
  },
  {
    batch: '039',
    name: 'Blue Dream',
    ph: 5.8,
    ec: 2.1,
    currentDay: 12,
    totalDays: 65,
    icon: 'opacity',
    isAlternate: true,
    camUrl: '/images/dashboard/3.png',
  },
  {
    batch: '041',
    name: 'OG Kush',
    ph: 6.0,
    ec: 1.9,
    currentDay: 31,
    totalDays: 75,
    icon: 'energy_savings_leaf',
    camUrl: '/images/dashboard/4.png',
  },
  {
    batch: '048',
    name: 'AK 47',
    ph: 6.1,
    ec: 2.0,
    currentDay: 5,
    totalDays: 70,
    icon: 'potted_plant',
    isAlternate: true,
    camUrl: '/images/dashboard/5.png',
  },
  {
    batch: '051',
    name: 'Sour Diesel',
    ph: 5.9,
    ec: 1.7,
    currentDay: 18,
    totalDays: 80,
    icon: 'opacity',
    camUrl: '/images/dashboard/6.png',
  },
  {
    batch: '060',
    name: 'Blue Dream (Lote B)',
    ph: 5.8,
    ec: 2.1,
    currentDay: 12,
    totalDays: 65,
    icon: 'opacity',
    isAlternate: true,
    camUrl: '/images/dashboard/3.png',
  },
  {
    batch: '061',
    name: 'OG Kush (Lote B)',
    ph: 6.0,
    ec: 1.9,
    currentDay: 31,
    totalDays: 75,
    icon: 'energy_savings_leaf',
    camUrl: '/images/dashboard/4.png',
  },
];

export default function CultivoPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen text-zinc-200 pb-24 font-sans">
      <div className="relative z-20">
        {/* Solid Green Header Area */}
        <div className="bg-[#A3E635] pt-3 pb-1 px-6 md:px-12 border-b border-[#07120b]/5">
          <div className="max-w-[2000px] mx-auto">
            <CultivoHeader 
              searchTerm={search} 
              onSearchChange={setSearch} 
            />
          </div>
        </div>

        {/* Gradient Transition Area (Behind Carousel) */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#A3E635] via-[#A3E635] via-40% to-transparent pointer-events-none -z-10" />
          <div className="w-full py-1">
            <CultivoCarousel />
          </div>
        </div>
      </div>

      <main className="pb-20 px-6 md:px-12 max-w-[2000px] mx-auto space-y-12 mt-12">
        <DashboardHeader />

        {/* Crops Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 stagger-children">
          {activeCrops
            .filter(crop => crop.name.toLowerCase().includes(search.toLowerCase()))
            .map((crop) => (
              <CropCard key={crop.batch} {...crop} />
          ))}
          <ExpandCropCard />
        </section>

        {/* Visuals Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GrowthChart />
          <MarketTeaser />
        </section>

        <SystemLog />
      </main>
    </div>
  );
}
