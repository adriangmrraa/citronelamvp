export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  category: string;
  stock: number;
  sellerUsername?: string;
  sellerId?: number;
  thc?: number | null;
  cbd?: number | null;
  discountPercentage?: number;
  originalPrice?: number;
  soldCount?: number;
  hasFreeShipping?: boolean;
  isLastUnit?: boolean;
  rating?: number;
  ratingCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MarketState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';
