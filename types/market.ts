export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  sellerUsername: string;
  discountPercentage?: number;
  originalPrice?: number;
  soldCount?: number;
  hasFreeShipping?: boolean;
  isLastUnit?: boolean;
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
