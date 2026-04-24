import { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Citronela — Cultivo Hidropónico',
  description: 'Plataforma de gestión de cultivos hidropónicos y marketplace. Registrá, monitoreá y hacé crecer tus plantas.',
};

export default function Home() {
  return <LandingPage />;
}
