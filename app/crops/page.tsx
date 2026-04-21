'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Demo data - Persisted in localStorage for demo
const DEMO_CROPS_INITIAL = [
  { id: 1, bucketName: 'Gorilla Glue', status: 'Verde', phase: 'Floracion', ph: 6.2, ec: 1.8, imageUrl: null, createdAt: '2024-01-15' },
  { id: 2, bucketName: 'Blue Dream', status: 'Amarillo', phase: 'Vegetacion', ph: 6.5, ec: 1.4, imageUrl: null, createdAt: '2024-02-01' },
  { id: 3, bucketName: 'Sour Diesel', status: 'Verde', phase: 'Germinacion', ph: 6.0, ec: 1.0, imageUrl: null, createdAt: '2024-02-10' },
];

const DEMO_LOGS_INITIAL = [
  { id: 1, week: 'Semana 12', phase: 'Floracion', ph: 6.2, ec: 1.8, grow: 15, micro: 10, bloom: 20, cropId: 1 },
  { id: 2, week: 'Semana 11', phase: 'Floracion', ph: 6.3, ec: 1.7, grow: 14, micro: 9, bloom: 18, cropId: 1 },
  { id: 3, week: 'Semana 10', phase: 'Transicion', ph: 6.4, ec: 1.5, grow: 12, micro: 8, bloom: 15, cropId: 1 },
  { id: 4, week: 'Semana 4', phase: 'Vegetacion', ph: 6.2, ec: 1.2, grow: 8, micro: 5, bloom: 0, cropId: 2 },
  { id: 5, week: 'Semana 3', phase: 'Vegetacion', ph: 6.3, ec: 1.0, grow: 6, micro: 4, bloom: 0, cropId: 2 },
  { id: 6, week: 'Semana 2', phase: 'Germinacion', ph: 6.0, ec: 0.8, grow: 4, micro: 2, bloom: 0, cropId: 3 },
];

const PHASES = ['Germinacion', 'Vegetacion', 'Transicion', 'Floracion'];
const STATUS_OPTIONS = ['Verde', 'Amarillo', 'Rojo'];

export default function CropsPage() {
  const router = useRouter();
  const [crops, setCrops] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [showNewBucket, setShowNewBucket] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [newBucket, setNewBucket] = useState({ bucketName: '', phase: 'Vegetacion', status: 'Verde' });
  const [newLog, setNewLog] = useState({ week: '', phase: '', ph: 6.0, ec: 1.0, grow: 10, micro: 5, bloom: 0 });
  const [calculator, setCalculator] = useState({ grow: 10, micro: 5, bloom: 10, water: 20 });
  const [editingCrop, setEditingCrop] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Load from localStorage or use demo data
  useEffect(() => {
    const storedCrops = localStorage.getItem('citronela_crops');
    const storedLogs = localStorage.getItem('citronela_logs');
    
    if (storedCrops) {
      setCrops(JSON.parse(storedCrops));
    } else {
      setCrops(DEMO_CROPS_INITIAL);
      localStorage.setItem('citronela_crops', JSON.stringify(DEMO_CROPS_INITIAL));
    }
    
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      setLogs(DEMO_LOGS_INITIAL);
      localStorage.setItem('citronela_logs', JSON.stringify(DEMO_LOGS_INITIAL));
    }

    // Reset notification after 3 seconds
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Select first crop by default
  useEffect(() => {
    if (crops.length > 0 && !selectedCrop) {
      setSelectedCrop(crops[0]);
    }
  }, [crops, selectedCrop]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-100 text-green-800';
      case 'Amarillo': return 'bg-yellow-100 text-yellow-800';
      case 'Rojo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addBucket = () => {
    if (!newBucket.bucketName.trim()) {
      showNotification('Ingresa un nombre para el bucket');
      return;
    }
    const crop = {
      id: Date.now(),
      ...newBucket,
      ph: 6.0,
      ec: 1.0,
      imageUrl: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...crops, crop];
    setCrops(updated);
    localStorage.setItem('citronela_crops', JSON.stringify(updated));
    setSelectedCrop(crop);
    setShowNewBucket(false);
    setNewBucket({ bucketName: '', phase: 'Vegetacion', status: 'Verde' });
    showNotification(`Bucket "${crop.bucketName}" creado`);
  };

  const deleteBucket = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este bucket?')) return;
    const updated = crops.filter(c => c.id !== id);
    setCrops(updated);
    localStorage.setItem('citronela_crops', JSON.stringify(updated));
    if (selectedCrop?.id === id) {
      setSelectedCrop(updated[0] || null);
    }
    showNotification('Bucket eliminado');
  };

  const updateBucket = () => {
    if (!editingCrop) return;
    const updated = crops.map(c => c.id === editingCrop.id ? { ...c, ...editingCrop } : c);
    setCrops(updated);
    localStorage.setItem('citronela_crops', JSON.stringify(updated));
    setSelectedCrop({ ...selectedCrop, ...editingCrop });
    setEditingCrop(null);
    showNotification('Bucket actualizado');
  };

  const addLog = () => {
    if (!selectedCrop || !newLog.week.trim()) {
      showNotification('Ingresa la semana');
      return;
    }
    const log = {
      id: Date.now(),
      ...newLog,
      cropId: selectedCrop.id
    };
    const updated = [...logs, log];
    setLogs(updated);
    localStorage.setItem('citronela_logs', JSON.stringify(updated));
    setShowAddLog(false);
    setNewLog({ week: '', phase: '', ph: 6.0, ec: 1.0, grow: 10, micro: 5, bloom: 0 });
    showNotification('Registro agregado');
  };

  const deleteLog = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este registro?')) return;
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem('citronela_logs', JSON.stringify(updated));
    showNotification('Registro eliminado');
  };

  const cropLogs = logs.filter(l => l.cropId === selectedCrop?.id).sort((a, b) => b.id - a.id);

  const calculateNutrients = () => {
    const { grow, micro, bloom, water } = calculator;
    return {
      growMl: (grow * water).toFixed(0),
      microMl: (micro * water).toFixed(0),
      bloomMl: (bloom * water).toFixed(0),
      waterLt: water
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
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
            <h1 className="text-xl font-bold text-gray-800">Mis Cultivos</h1>
          </div>
          <button 
            onClick={() => setShowNewBucket(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-300 flex items-center gap-2 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo Bucket
          </button>
        </div>
      </header>

      {/* New Bucket Modal */}
      {showNewBucket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Nuevo Bucket</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newBucket.bucketName}
                  onChange={(e) => setNewBucket({ ...newBucket, bucketName: e.target.value })}
                  placeholder="Nombre del cultivo"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fase</label>
                <select
                  value={newBucket.phase}
                  onChange={(e) => setNewBucket({ ...newBucket, phase: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {PHASES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={newBucket.status}
                  onChange={(e) => setNewBucket({ ...newBucket, status: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewBucket(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={addBucket}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Crop Modal */}
      {editingCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Editar Bucket</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingCrop.bucketName}
                  onChange={(e) => setEditingCrop({ ...editingCrop, bucketName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fase</label>
                <select
                  value={editingCrop.phase}
                  onChange={(e) => setEditingCrop({ ...editingCrop, phase: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {PHASES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={editingCrop.status}
                  onChange={(e) => setEditingCrop({ ...editingCrop, status: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCrop.ph}
                    onChange={(e) => setEditingCrop({ ...editingCrop, ph: parseFloat(e.target.value) })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EC</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCrop.ec}
                    onChange={(e) => setEditingCrop({ ...editingCrop, ec: parseFloat(e.target.value) })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCrop(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={updateBucket}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Empty State */}
        {crops.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-2xl flex items-center justify-center">
              <span className="text-5xl">🌱</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin cultivos todavía</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Crea tu primer bucket para empezar a registrar el progreso de tus plantas</p>
            <button 
              onClick={() => setShowNewBucket(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-600/25 transition-all duration-300 font-medium"
            >
              Crear Primer Bucket
            </button>
          </div>
        )}

        {/* Crops Grid */}
        {crops.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8 stagger-children">
            {crops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`bg-white p-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 relative group ${
                  selectedCrop?.id === crop.id ? 'ring-2 ring-green-500 ring-offset-2' : 'hover:ring-1 hover:ring-green-300'
                }`}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingCrop(crop); }}
                    className="w-8 h-8 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => deleteBucket(crop.id, e)}
                    className="w-8 h-8 bg-gray-100 hover:bg-red-100 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{crop.bucketName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(crop.status)}`}>
                    {crop.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Fase: {crop.phase}</p>
                  <p>pH: {crop.ph} | EC: {crop.ec}</p>
                  <p className="text-xs text-gray-400">Desde: {crop.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Crop Details */}
        {selectedCrop && crops.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedCrop.bucketName}</h2>
                <p className="text-gray-600">{selectedCrop.phase} • pH: {selectedCrop.ph} • EC: {selectedCrop.ec}</p>
                <p className="text-sm text-gray-400 mt-1">Creado: {selectedCrop.createdAt}</p>
              </div>
              <button 
                onClick={() => setShowCalculator(true)}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 flex items-center gap-2"
              >
                🧪 Calculadora
              </button>
            </div>

            {/* Calculator Panel */}
            {showCalculator && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">🧪 Calculadora de Nutrientes</h3>
                  <button onClick={() => setShowCalculator(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Grow (ml/L)</label>
                    <input
                      type="number"
                      value={calculator.grow}
                      onChange={(e) => setCalculator({ ...calculator, grow: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Micro (ml/L)</label>
                    <input
                      type="number"
                      value={calculator.micro}
                      onChange={(e) => setCalculator({ ...calculator, micro: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bloom (ml/L)</label>
                    <input
                      type="number"
                      value={calculator.bloom}
                      onChange={(e) => setCalculator({ ...calculator, bloom: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Agua (L)</label>
                    <input
                      type="number"
                      value={calculator.water}
                      onChange={(e) => setCalculator({ ...calculator, water: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-700">Grow Total</p>
                    <p className="text-2xl font-bold text-green-800">{calculateNutrients().growMl}ml</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-700">Micro Total</p>
                    <p className="text-2xl font-bold text-blue-800">{calculateNutrients().microMl}ml</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-purple-700">Bloom Total</p>
                    <p className="text-2xl font-bold text-purple-800">{calculateNutrients().bloomMl}ml</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-700">Agua</p>
                    <p className="text-2xl font-bold text-gray-800">{calculateNutrients().waterLt}L</p>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Logs */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Registros Semanales</h3>
                <button 
                  onClick={() => {
                    setNewLog({ ...newLog, phase: selectedCrop.phase });
                    setShowAddLog(true);
                  }}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  + Agregar Registro
                </button>
              </div>

              {cropLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay registros todavía</p>
                  <button 
                    onClick={() => setShowAddLog(true)}
                    className="text-green-600 hover:underline mt-2"
                  >
                    Agregar primer registro
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Semana</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fase</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">pH</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">EC</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Grow</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Micro</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Bloom</th>
                        <th className="text-left py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cropLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{log.week}</td>
                          <td className="py-3 px-4">{log.phase}</td>
                          <td className="py-3 px-4">{log.ph}</td>
                          <td className="py-3 px-4">{log.ec}</td>
                          <td className="py-3 px-4">{log.grow}ml</td>
                          <td className="py-3 px-4">{log.micro}ml</td>
                          <td className="py-3 px-4">{log.bloom}ml</td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={(e) => deleteLog(log.id, e)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add Log Modal */}
            {showAddLog && (
              <div className="p-6 border-t bg-gray-50">
                <h4 className="font-semibold mb-4">Nuevo Registro</h4>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Semana</label>
                    <input
                      type="text"
                      value={newLog.week}
                      onChange={(e) => setNewLog({ ...newLog, week: e.target.value })}
                      placeholder="ej: Semana 5"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fase</label>
                    <select
                      value={newLog.phase}
                      onChange={(e) => setNewLog({ ...newLog, phase: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Seleccionar</option>
                      {PHASES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newLog.ph}
                      onChange={(e) => setNewLog({ ...newLog, ph: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">EC</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newLog.ec}
                      onChange={(e) => setNewLog({ ...newLog, ec: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Grow (ml/L)</label>
                    <input
                      type="number"
                      value={newLog.grow}
                      onChange={(e) => setNewLog({ ...newLog, grow: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Micro (ml/L)</label>
                    <input
                      type="number"
                      value={newLog.micro}
                      onChange={(e) => setNewLog({ ...newLog, micro: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bloom (ml/L)</label>
                    <input
                      type="number"
                      value={newLog.bloom}
                      onChange={(e) => setNewLog({ ...newLog, bloom: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddLog(false)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addLog}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}