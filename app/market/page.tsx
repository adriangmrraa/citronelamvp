'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Demo products
const DEMO_PRODUCTS_INITIAL = [
  { id: 1, name: 'Gorilla Glue fem', category: 'Flores', price: 8000, stock: 5, seller: 'GrowerPro', description: 'Variedad indica dominante, efecto relajante' },
  { id: 2, name: 'Blue Dream fem', category: 'Flores', price: 7500, stock: 3, seller: 'SeedMaster', description: 'Híbrida sativa, aroma afrutado' },
  { id: 3, name: 'Sour Diesel fem', category: 'Flores', price: 7000, stock: 8, seller: 'CBDstore', description: 'Sativa dominante, energía cerebral' },
  { id: 4, name: 'Maceta 5L', category: 'Parafernalia', price: 1200, stock: 50, seller: 'HydroShop', description: 'Maceta de tela, drenaje óptimo' },
  { id: 5, name: 'Bomba de aire', category: 'Parafernalia', price: 3500, stock: 12, seller: 'HydroShop', description: 'Bomba 1000L/h silenciosa' },
  { id: 6, name: 'Kit nutrients', category: 'Parafernalia', price: 15000, stock: 20, seller: 'NutriMax', description: 'Kit completo FloraSeries' },
  { id: 7, name: 'Purple Punch', category: 'Geneticas', price: 5000, stock: 2, seller: 'Breeder001', description: 'Semillas feminizadas x5' },
  { id: 8, name: 'Gelato fem', category: 'Geneticas', price: 8500, stock: 4, seller: 'Breeder001', description: 'Semillas feminizadas x5' },
  { id: 9, name: 'LED 300W Full Spectrum', category: 'Iluminacion', price: 45000, stock: 8, seller: 'GrowLight', description: 'Panel LED bajo consumo' },
  { id: 10, name: 'Tierra organique mix', category: 'Sustratos', price: 2500, stock: 30, seller: 'SoilPro', description: 'Tierra enriched 20L' },
];

const CATEGORIES = ['Todas', 'Flores', 'Geneticas', 'Parafernalia', 'Iluminacion', 'Sustratos'];

export default function MarketPage() {
  const [products, setProducts] = useState<any[]>(DEMO_PRODUCTS_INITIAL);
  const [category, setCategory] = useState('Todas');
  const [cart, setCart] = useState<{productId: number, qty: number}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderData, setOrderData] = useState({
    name: '', email: '', phone: '', address: '', city: '', paymentMethod: 'transfer'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('citronela_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = category === 'Todas' ? products : products.filter(p => p.category === category);

  const addToCart = (productId: number, qty: number = 1) => {
    const existing = cart.find(c => c.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    if (existing) {
      const newQty = existing.qty + qty;
      if (newQty > product.stock) {
        showNotification('Stock máximo alcanzado');
        return;
      }
      const updated = cart.map(c => c.productId === productId ? { ...c, qty: newQty } : c);
      setCart(updated);
      localStorage.setItem('citronela_cart', JSON.stringify(updated));
    } else {
      const updated = [...cart, { productId, qty }];
      setCart(updated);
      localStorage.setItem('citronela_cart', JSON.stringify(updated));
    }
    showNotification(`${product.name} agregado al carrito`);
  };

  const updateCartQty = (productId: number, qty: number) => {
    const product = products.find(p => p.id === productId);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (qty > (product?.stock || 0)) {
      showNotification('Stock máximo alcanzado');
      return;
    }
    const updated = cart.map(c => c.productId === productId ? { ...c, qty } : c);
    setCart(updated);
    localStorage.setItem('citronela_cart', JSON.stringify(updated));
  };

  const removeFromCart = (productId: number) => {
    const updated = cart.filter(c => c.productId !== productId);
    setCart(updated);
    localStorage.setItem('citronela_cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (!confirm('¿Vaciar todo el carrito?')) return;
    setCart([]);
    localStorage.removeItem('citronela_cart');
    showNotification('Carrito vaciado');
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + ((product?.price || 0) * item.qty);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  };

  const placeOrder = () => {
    if (!orderData.name || !orderData.email || !orderData.address) {
      showNotification('Completá todos los campos requeridos');
      return;
    }
    // In demo mode, just show success
    setOrderPlaced(true);
    setCart([]);
    localStorage.removeItem('citronela_cart');
    showNotification('¡Pedido realizado con éxito!');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Order Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">¡Pedido Realizado!</h2>
            <p className="text-gray-600 mb-4">Tu pedido ha sido confirmado. En un entorno real, recibirías un email con los datos de pago.</p>
            <button
              onClick={() => { setOrderPlaced(false); setShowCheckout(false); setCheckoutStep(1); setOrderData({name: '', email: '', phone: '', address: '', city: '', paymentMethod: 'transfer'}); }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              <div className="flex gap-6">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{selectedProduct.category}</span>
                  <h2 className="text-2xl font-bold mt-2">{selectedProduct.name}</h2>
                  <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span>Vendedor: {selectedProduct.seller}</span>
                    <span className={selectedProduct.stock > 5 ? 'text-green-600' : 'text-orange-600'}>
                      Stock: {selectedProduct.stock} unidades
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-3xl font-bold text-green-600">${formatPrice(selectedProduct.price)}</span>
                    <button
                      onClick={() => { addToCart(selectedProduct.id); setSelectedProduct(null); }}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && !orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Finalizar Compra</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            
            {/* Checkout Steps */}
            <div className="p-6">
              {checkoutStep === 1 && (
                <>
                  <h3 className="font-semibold mb-4">1. Revisá tu carrito</h3>
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cart.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📦</span>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">${formatPrice(product.price)} x {item.qty}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQty(item.productId, item.qty - 1)} className="w-8 h-8 bg-gray-200 rounded">-</button>
                            <span className="w-8 text-center">{item.qty}</span>
                            <button onClick={() => updateCartQty(item.productId, item.qty + 1)} className="w-8 h-8 bg-gray-200 rounded">+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span>${formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                  <button onClick={() => setCheckoutStep(2)} className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700">
                    Continuar
                  </button>
                </>
              )}

              {checkoutStep === 2 && (
                <>
                  <h3 className="font-semibold mb-4">2. Datos de entrega</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input
                        type="text"
                        value={orderData.name}
                        onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={orderData.email}
                        onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={orderData.phone}
                        onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                      <input
                        type="text"
                        value={orderData.address}
                        onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                      <input
                        type="text"
                        value={orderData.city}
                        onChange={(e) => setOrderData({...orderData, city: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setCheckoutStep(1)} className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg">
                      Volver
                    </button>
                    <button onClick={() => setCheckoutStep(3)} className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg">
                      Continuar
                    </button>
                  </div>
                </>
              )}

              {checkoutStep === 3 && (
                <>
                  <h3 className="font-semibold mb-4">3. Método de pago</h3>
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-green-50">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="transfer" checked={orderData.paymentMethod === 'transfer'} onChange={() => setOrderData({...orderData, paymentMethod: 'transfer'})} />
                        <span>Transferencia bancaria</span>
                      </div>
                      <span className="text-2xl">🏦</span>
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-green-50">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="mercadopago" checked={orderData.paymentMethod === 'mercadopago'} onChange={() => setOrderData({...orderData, paymentMethod: 'mercadopago'})} />
                        <span>MercadoPago</span>
                      </div>
                      <span className="text-2xl">💳</span>
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-green-50">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="cash" checked={orderData.paymentMethod === 'cash'} onChange={() => setOrderData({...orderData, paymentMethod: 'cash'})} />
                        <span>Efectivo contra entrega</span>
                      </div>
                      <span className="text-2xl">💵</span>
                    </label>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total a pagar:</span>
                      <span className="text-green-600">${formatPrice(getCartTotal())}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setCheckoutStep(2)} className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg">
                      Volver
                    </button>
                    <button onClick={placeOrder} className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700">
                      Confirmar Pedido
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-green-600 transition-colors duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="text-sm font-medium">Volver</span>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <h1 className="text-xl font-bold text-gray-800">Mercado</h1>
          </div>
          <button 
            onClick={() => { if (cart.length > 0) setShowCheckout(true); }}
            className="relative bg-gray-50 hover:bg-green-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 border border-gray-200 hover:border-green-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-sm font-medium text-gray-700">Carrito</span>
            {cart.length > 0 && (
              <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                category === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-4 gap-6 stagger-children">
          {filtered.map(product => {
            const cartItem = cart.find(c => c.productId === product.id);
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer group-hover:from-green-50 group-hover:to-green-100/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">📦</span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{product.category}</span>
                  <h3 className="text-base font-bold text-gray-800 mt-3 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500">por {product.seller}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Precio</p>
                      <span className="text-xl font-bold text-green-600">${formatPrice(product.price)}</span>
                    </div>
                    {cartItem ? (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, cartItem.qty - 1); }}
                          className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-800">{cartItem.qty}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, cartItem.qty + 1); }}
                          className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-300 font-medium text-sm"
                      >
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">No hay productos en esta categoría</p>
          </div>
        )}
      </main>

      {/* Cart Bottom Bar */}
      {cart.length > 0 && !showCheckout && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-gray-600">{getCartItemCount()} productos</p>
              <p className="text-2xl font-bold">Total: ${formatPrice(getCartTotal())}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
              >
                Vaciar
              </button>
              <button 
                onClick={() => setShowCheckout(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}