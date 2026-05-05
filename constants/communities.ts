import { ForumCategory } from '@/types/forum';

export interface Community {
  id: ForumCategory;
  name: string;
  description: string;
  banner: string;
  color: string;
  icon: string;
  stats: {
    members: string;
    online: string;
  };
}

export const COMMUNITIES: Record<ForumCategory, Community> = {
  'Perfil': {
    id: 'Perfil',
    name: 'Tu Identidad en el Foro',
    description: 'Gestiona tu presencia, publicaciones y conexiones dentro de la comunidad Citronela.',
    banner: '/images/bg/hero.jpg',
    color: '#A3E635',
    icon: 'account_circle',
    stats: {
      members: '-',
      online: '-'
    }
  },
  'Todo': {
    id: 'Todo',
    name: 'Feed Global Citronela',
    description: 'El pulso de toda la red Citronela. Discusiones generales, tendencias y lo más relevante de todas las comunidades.',
    banner: '/images/bg/hero.jpg',
    color: '#A3E635',
    icon: 'Public',
    stats: {
      members: '12.4k',
      online: '842'
    }
  },
  'Investigación': {
    id: 'Investigación',
    name: 'Genética & Cultivo',
    description: 'Espacio dedicado al estudio profundo de la planta, optimización de cultivos y desarrollo de nuevas genéticas.',
    banner: '/images/bg/cultivo.jpg',
    color: '#A3E635',
    icon: 'Science',
    stats: {
      members: '4.2k',
      online: '156'
    }
  },
  'Debate': {
    id: 'Debate',
    name: 'El Club del Humo',
    description: 'Cultura, sociedad y debates abiertos sobre el presente y futuro del sector. Relájate y comparte.',
    banner: '/images/bg/community.jpg',
    color: '#fbbf24',
    icon: 'Groups',
    stats: {
      members: '5.8k',
      online: '312'
    }
  },
  'Anuncio': {
    id: 'Anuncio',
    name: 'Boletín Oficial',
    description: 'Comunicaciones institucionales, actualizaciones de la plataforma y noticias críticas de Citronela.',
    banner: '/images/bg/market.jpg',
    color: '#3b82f6',
    icon: 'Campaign',
    stats: {
      members: '12.4k',
      online: '1.2k'
    }
  },
  'Papers': {
    id: 'Papers',
    name: 'Biblioteca Científica',
    description: 'Repositorio de estudios científicos, papers técnicos y documentación académica verificada.',
    banner: '/images/bg/cta.jpg',
    color: '#ffffff',
    icon: 'Menu_Book',
    stats: {
      members: '2.1k',
      online: '45'
    }
  }
};
