import { useState, useEffect } from 'react';
import { ProfileActivity, UserProfileData, UserSettings } from '@/types/profile';

const MOCK_ACTIVITY: ProfileActivity[] = [
  {
    id: '1',
    type: 'purchase',
    title: 'Semillas Gorilla Glue',
    date: '2026-05-01',
    amount: '-500 TOKENS',
    description: 'Compra en Citromarket'
  },
  {
    id: '2',
    type: 'token_earn',
    title: 'Recompensa Diaria',
    date: '2026-05-02',
    amount: '+50 TOKENS',
    description: 'Logueo diario'
  },
  {
    id: '3',
    type: 'event',
    title: 'Expo Cannabica 2026',
    date: '2026-05-03',
    description: 'Registro confirmado'
  },
  {
    id: '4',
    type: 'post',
    title: 'Guía de Secado',
    date: '2026-05-04',
    description: 'Posteado en Citroforo'
  }
];

const MOCK_USER_DATA: UserProfileData = {
  username: 'CitroUser',
  tokens: 100000,
  joinDate: 'Enero 2026',
  rank: 'Cultivador Pro',
  stats: {
    posts: 12,
    purchases: 5,
    events: 2
  }
};

export function useProfile() {
  const [activity, setActivity] = useState<ProfileActivity[]>([]);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    darkMode: true,
    newsletter: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de API
    const timer = setTimeout(() => {
      setActivity(MOCK_ACTIVITY);
      setUserData(MOCK_USER_DATA);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Acá iría el fetch al backend en el futuro
  };

  return {
    activity,
    userData,
    settings,
    isLoading,
    updateSettings
  };
}
