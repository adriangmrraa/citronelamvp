'use client';

import { useState } from 'react';
import Link from 'next/link';

// Demo products
const DEMO_PRODUCTS = [
  { id: 1, name: 'Gorilla Glue fem', category: 'Flores', price: 8000, stock: 5, seller: 'GrowerPro' },
  { id: 2, name: 'Blue Dream fem', category: 'Flores', price: 7500, stock: 3, seller: 'SeedMaster' },
  { id: 3, name: 'Sour Diesel fem', category: 'Flores', price: 7000, stock: 8, seller: 'CBDstore' },
  { id: 4, name: 'Maceta 5L', category: 'Parafernalia', price: 1200, stock: 50, seller: 'HydroShop' },
  { id: 5, name: 'Bomba de aire', category: 'Parafernalia', price: 3500, stock: 12, seller: 'HydroShop' },
  { id: 6, name: 'Kit nutrients', category: 'Parafernalia', price: 15000, stock: 20, seller: 'NutriMax' },
  { id: 7, name: 'Purple Punch', category: 'Geneticas', price: 5000, stock: 2, seller: 'Breeder001' },
  { id: 8, name: 'Gelato fem', category: 'Geneticas', price: 8500, stock: 4, seller: 'Breeder001' },
];

const CATEGORIES = ['Todas', 'Flores', 'Parafernalia', 'Geneticas'];

export default function MarketPage() {
  const [products] = useState(DEMO_PRODUCTS);
  const [category, setCategory] = useState('Todas');
  const [cart, setCart] = useState<number[]>([]);

  const filtered = category === 'Todas' ? products : products.filter(p => p.category === category);

  const addToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(c => c !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, id) => {
      const product = products.find(p => p.id === id);
      return sum + (product?.price || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-green-600 hover:text-green-700">← Volver</Link>
            <h1 className="text-2xl font-bold text-green-800">🛒 Mercado</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-green-600">
              🛒 Carrito ({cart.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg ${
                category === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {filtered.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-500">Vendedor: {product.seller}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-green-600">${product.price}</span>
                {cart.includes(product.id) ? (
                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Quitar
                  </button>
                ) : (
                  <button 
                    onClick={() => addToCart(product.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Agregar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar / Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div>
                <p className="text-gray-600">{cart.length} productos en carrito</p>
                <p className="text-2xl font-bold">Total: ${getCartTotal()}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCart([])}
                  className="text-red-600 hover:text-red-700"
                >
                  Vaciar
                </button>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}