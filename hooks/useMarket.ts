"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, SortOption } from '@/types/market';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Citronela OG Kush Auto',
    description: 'Semillas automáticas de alta potencia y sabor cítrico.',
    price: 450,
    image: '/images/market/1.jpg',
    category: 'Semillas',
    stock: 12,
    sellerUsername: 'CitroGrower'
  },
  {
    id: 2,
    name: 'Super Soil Organic Mix',
    description: 'Sustrato cargado de nutrientes para todo el ciclo.',
    price: 180,
    image: '/images/market/2.jpg',
    category: 'Sustratos',
    stock: 25,
    sellerUsername: 'EcoTerra'
  },
  {
    id: 3,
    name: 'CitroLED Pro 250W',
    description: 'Panel LED full spectrum con chips Samsung LH301H.',
    price: 3200,
    image: '/images/market/3.jpg',
    category: 'Equipamiento',
    stock: 5,
    sellerUsername: 'TechGrow'
  },
  {
    id: 4,
    name: 'Pack Nutrientes Flora Bloom',
    description: 'Fertilizantes orgánicos para una floración densa.',
    price: 750,
    image: '/images/market/4.jpg',
    category: 'Nutrientes',
    stock: 15,
    sellerUsername: 'CitroLab'
  },
  {
    id: 5,
    name: 'Picador Citronela Zinc',
    description: '4 partes, dientes diamante, acabado premium.',
    price: 120,
    image: '/images/market/5.jpg',
    category: 'Parafernalia',
    stock: 40,
    sellerUsername: 'CitroStyle'
  },
  {
    id: 6,
    name: 'Carpas Grow Elite 100x100',
    description: 'Mylar 1680D, estructura reforzada, cierre hermético.',
    price: 1500,
    image: '/images/market/6.jpg',
    category: 'Equipamiento',
    stock: 8,
    sellerUsername: 'GrowCenter'
  },
  {
    id: 7,
    name: 'Aceite CBD 10% Relax',
    description: 'Extracto de cáñamo premium para bienestar diario.',
    price: 850,
    image: '/images/market/7.jpg',
    category: 'Bienestar',
    stock: 20,
    sellerUsername: 'CitroHealth'
  },
  {
    id: 8,
    name: 'Vaporizador Herbal G-Pro',
    description: 'Calentamiento por convección, control de temperatura.',
    price: 2100,
    image: '/images/market/8.jpg',
    category: 'Parafernalia',
    stock: 10,
    sellerUsername: 'VapeMaster'
  },
  {
    id: 9,
    name: 'Bandeja de Madera Tallada',
    description: 'Artesanía local para un armado perfecto.',
    price: 300,
    image: '/images/market/9.jpg',
    category: 'Accesorios',
    stock: 12,
    sellerUsername: 'WoodArt'
  },
  {
    id: 10,
    name: 'Extractores Ducto 6"',
    description: 'Gran caudal, bajo ruido, ideal para grandes carpas.',
    price: 550,
    image: '/images/market/10.jpg',
    category: 'Equipamiento',
    stock: 15,
    sellerUsername: 'TechGrow'
  },
  {
    id: 11,
    name: 'Semillas Gorilla Glue #4',
    description: 'Clásico americano, resina extrema y efecto potente.',
    price: 600,
    image: '/images/market/11.jpg',
    category: 'Semillas',
    stock: 6,
    sellerUsername: 'CitroGrower'
  },
  {
    id: 12,
    name: 'Termo-Higrómetro Digital',
    description: 'Sensor externo para medir temperatura y humedad.',
    price: 150,
    image: '/images/market/12.jpg',
    category: 'Accesorios',
    stock: 30,
    sellerUsername: 'HydroTools'
  },
  {
    id: 13,
    name: 'Micorrizas Premium 50g',
    description: 'Hongos beneficiosos para raíces explosivas.',
    price: 90,
    image: '/images/market/13.jpg',
    category: 'Nutrientes',
    stock: 50,
    sellerUsername: 'BioRoots'
  },
  {
    id: 14,
    name: 'Pipas de Vidrio Soplado',
    description: 'Diseños únicos, vidrio borosilicato resistente.',
    price: 250,
    image: '/images/market/14.jpg',
    category: 'Parafernalia',
    stock: 18,
    sellerUsername: 'GlassMaster'
  },
  {
    id: 15,
    name: 'Sustrato Coco Mix 50L',
    description: 'Fibra de coco lavada y estabilizada, pH neutro.',
    price: 320,
    image: '/images/market/15.jpg',
    category: 'Sustratos',
    stock: 20,
    sellerUsername: 'EcoTerra'
  },
  {
    id: 16,
    name: 'Kit de Cultivo Principiante',
    description: 'Todo lo que necesitás para arrancar tu primer indoor.',
    price: 4500,
    image: '/images/market/16.jpg',
    category: 'Equipamiento',
    stock: 3,
    sellerUsername: 'CitroLab'
  },
  {
    id: 17,
    name: 'Tijeras de Poda Pro-Trim',
    description: 'Acero inoxidable, punta curva para máxima precisión.',
    price: 85,
    image: '/images/market/17.jpg',
    category: 'Accesorios',
    stock: 25,
    sellerUsername: 'GrowTools'
  },
  {
    id: 18,
    name: 'Lámpara de Secado UV-C',
    description: 'Elimina patógenos y acelera el proceso de curado.',
    price: 420,
    image: '/images/market/18.jpg',
    category: 'Equipamiento',
    stock: 7,
    sellerUsername: 'TechGrow'
  },
  {
    id: 19,
    name: 'Semillas Haze Berry Auto',
    description: 'Cruce de Blueberry y Shining Silver Haze, sabor frutal.',
    price: 480,
    image: '/images/market/19.jpg',
    category: 'Semillas',
    stock: 10,
    sellerUsername: 'CitroGrower'
  },
  {
    id: 20,
    name: 'Baliza de Cultivo Smart',
    description: 'Control remoto de fotoperiodo vía WiFi.',
    price: 950,
    image: '/images/market/20.jpg',
    category: 'Equipamiento',
    stock: 4,
    sellerUsername: 'CitroLab'
  },
  {
    id: 21,
    name: 'Citronela Purple Haze Auto',
    description: 'Variedad clásica con tonos violetas y aroma terroso.',
    price: 490,
    image: '/images/market/1.jpg',
    category: 'Semillas',
    stock: 15,
    sellerUsername: 'CitroGrower'
  },
  {
    id: 22,
    name: 'Luz de Apoyo GrowBloom 100W',
    description: 'Ideal para complementar áreas de sombra en tu indoor.',
    price: 850,
    image: '/images/market/3.jpg',
    category: 'Equipamiento',
    stock: 10,
    sellerUsername: 'TechGrow'
  }
];

const ENHANCED_MOCK_PRODUCTS: Product[] = MOCK_PRODUCTS.map((p, idx) => {
  // Random sold counts for all
  const soldCount = Math.floor(Math.random() * 200) + 5;
  
  // Specific IDs for special features to ensure consistency (or can use random logic)
  const discountPercentage = [1, 4, 7, 10, 13, 16, 19].includes(idx + 1) ? Math.floor(Math.random() * 15) + 5 : undefined;
  const hasFreeShipping = [2, 5, 8, 11, 14].includes(idx + 1);
  const isLastUnit = [3, 6, 9].includes(idx + 1);
  
  // Rating logic
  const rating = Number((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1));
  const ratingCount = Math.floor(Math.random() * 490) + 10;
  
  return {
    ...p,
    soldCount,
    discountPercentage,
    originalPrice: discountPercentage ? Math.round(p.price * (1 + discountPercentage / 100)) : undefined,
    hasFreeShipping,
    isLastUnit,
    rating,
    ratingCount
  };
});

export type FilterTab = 'Todos' | 'Más vendidos' | 'Ofertas' | 'Envío gratis';

export function useMarket() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<FilterTab>('Todos');
  const [sort, setSort] = useState<SortOption>('newest');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    try {
      setProducts(ENHANCED_MOCK_PRODUCTS);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos del mercado');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (category !== 'Todos') {
      result = result.filter(p => p.category === category);
    }

    // Tabs Filter
    if (activeTab === 'Ofertas') {
      result = result.filter(p => p.discountPercentage !== undefined);
    } else if (activeTab === 'Envío gratis') {
      result = result.filter(p => p.hasFreeShipping);
    } else if (activeTab === 'Más vendidos') {
      result = result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    // Search Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, search, category, activeTab, sort]);

  return { 
    products: filteredProducts, 
    isLoading, 
    error, 
    search, 
    setSearch, 
    category, 
    setCategory, 
    activeTab,
    setActiveTab,
    sort, 
    setSort,
    refreshProducts: fetchProducts 
  };
}
