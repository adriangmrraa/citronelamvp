import { useCartContext } from '@/context/CartContext';

export function useCart() {
  // Ahora el hook es solo un "puente" al contexto global
  return useCartContext();
}
