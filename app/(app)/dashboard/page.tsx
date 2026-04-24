import { DashboardHeader } from '@/components/features/dashboard/DashboardHeader';
import { CropCard } from '@/components/features/dashboard/CropCard';
import { GrowthChart } from '@/components/features/dashboard/GrowthChart';
import { MarketTeaser } from '@/components/features/dashboard/MarketTeaser';
import { SystemLog } from '@/components/features/dashboard/SystemLog';
import { ExpandCropCard } from '@/components/features/dashboard/ExpandCropCard';

const activeCrops = [
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
];

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      {/* Cinematic Background Elements */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.05] animate-bg-drift bg-cover bg-center grayscale contrast-125"
        style={{ backgroundImage: "url('/images/bg/hero.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-grid-weed opacity-[0.05]" />
      
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <DashboardHeader />

        {/* Crops Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {activeCrops.map((crop) => (
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
