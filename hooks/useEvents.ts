import { useState, useEffect } from 'react';
import { EventData } from '@/types/events';

export const TRENDING_MOCK_DATA: EventData[] = [
  {
    id: 1,
    title: 'Expo Cannabica',
    date: '10 de Julio',
    time: '18hs',
    location: 'Club 24, Córdoba',
    img: '/images/events/1.jpg',
    attendees: 20,
    price: '25 TOKENS'
  },
  {
    id: 2,
    title: 'Terapia Cannabica',
    date: '08 de Febrero',
    time: '10hs',
    location: 'Plaza de la Intendencia, Córdoba',
    img: '/images/events/2.jpg',
    attendees: 45,
    price: 'GRATIS'
  },
  {
    id: 3,
    title: 'Curso de Hidroponia',
    date: '04 de Mayo',
    time: '10hs',
    location: "O'Higgings 585, Córdoba",
    img: '/images/events/3.jpg',
    attendees: 12,
    price: '10 TOKENS'
  },
  {
    id: 101,
    title: 'Marcha mundial de la Marihuana',
    date: '4 de Mayo',
    time: '16hs',
    location: 'Palermo, BA',
    img: '/images/events/4.jpg',
    attendees: 1540,
    price: 'GRATIS'
  },
  {
    id: 102,
    title: 'Cata de Variedades Club 24',
    date: '12 de Mayo',
    time: '20hs',
    location: 'Córdoba Capital',
    img: '/images/events/1.jpg',
    attendees: 50,
    price: '15 TOKENS'
  },
  {
    id: 103,
    title: 'Taller de Extracciones BHO',
    date: '15 de Mayo',
    time: '17hs',
    location: 'CitroLab, Rosario',
    img: '/images/events/2.jpg',
    attendees: 15,
    price: '20 TOKENS'
  },
  {
    id: 104,
    title: 'Conferencia Medicina Verde',
    date: '20 de Mayo',
    time: '18hs',
    location: 'Hotel Sheraton, BA',
    img: '/images/events/3.jpg',
    attendees: 300,
    price: 'GRATIS'
  },
  {
    id: 105,
    title: 'Copa Citronela 2026',
    date: '25 de Mayo',
    time: '10hs',
    location: 'Predio Rural, Córdoba',
    img: '/images/events/4.jpg',
    attendees: 500,
    price: '30 TOKENS'
  },
  {
    id: 106,
    title: 'Workshop Cultivo Exterior',
    date: '02 de Junio',
    time: '11hs',
    location: 'Vivero Citro, Salta',
    img: '/images/events/1.jpg',
    attendees: 40,
    price: '10 TOKENS'
  },
  {
    id: 107,
    title: 'After Grow Sessions',
    date: '05 de Junio',
    time: '19hs',
    location: 'Terraza Citro, BA',
    img: '/images/events/2.jpg',
    attendees: 80,
    price: 'GRATIS'
  },
  {
    id: 108,
    title: 'Seminario Suelos Vivos',
    date: '10 de Junio',
    time: '16hs',
    location: 'Huerta Orgánica, Mendoza',
    img: '/images/events/3.jpg',
    attendees: 25,
    price: '15 TOKENS'
  },
  {
    id: 109,
    title: 'Festival CitroSound',
    date: '15 de Junio',
    time: '14hs',
    location: 'Parque Sarmiento, Córdoba',
    img: '/images/events/4.jpg',
    attendees: 2000,
    price: '40 TOKENS'
  }
];

export const UPCOMING_MOCK_DATA: EventData[] = [
  {
    id: 110,
    title: 'Clínica de Armado Pro',
    date: '18 de Junio',
    time: '21hs',
    location: 'Social Club, BA',
    img: '/images/events/1.jpg',
    attendees: 20,
    price: '5 TOKENS'
  },
  {
    id: 111,
    title: 'Encuentro de Breeders',
    date: '22 de Junio',
    time: '15hs',
    location: 'CitroLab, Rosario',
    img: '/images/events/2.jpg',
    attendees: 30,
    price: '25 TOKENS'
  },
  {
    id: 112,
    title: 'Fiesta de Solsticio Invierno',
    date: '24 de Junio',
    time: '23hs',
    location: 'Club Secreto, Córdoba',
    img: '/images/events/3.jpg',
    attendees: 150,
    price: '20 TOKENS'
  }
];

export const ALL_EVENTS = [...TRENDING_MOCK_DATA, ...UPCOMING_MOCK_DATA];

export function useTrendingEvents(searchTerm: string = '') {
  const [data, setData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        const filtered = TRENDING_MOCK_DATA.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setData(filtered);
        setError(null);
      } catch (err) {
        setError('Error al cargar los eventos destacados');
      } finally {
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { data, isLoading, error };
}

export function useUpcomingEvents(searchTerm: string = '') {
  const [data, setData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        const filtered = UPCOMING_MOCK_DATA.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setData(filtered);
        setError(null);
      } catch (err) {
        setError('Error al cargar los próximos eventos');
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { data, isLoading, error };
}
