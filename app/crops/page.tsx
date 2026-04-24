'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2, FlaskConical, X } from 'lucide-react';

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

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-lime-400/10 text-lime-400',
  Amarillo: 'bg-yellow-400/10 text-yellow-400',
  Rojo: 'bg-red-500/10 text-red-400',
};

const inputClass = 'w-full border border-white/[0.08] rounded-lg px-4 py-2 bg-white/[0.04] text-zinc-100 placeholder-zinc-600 focus:ring-2 focus:ring-lime-400/50 focus:outline-none transition';
const labelClass = 'block text-xs text-zinc-400 mb-1';

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
      createdAt: new Date().toISOString().split('T')[0],
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
    const updated = crops.filter((c) => c.id !== id);
    setCrops(updated);
    localStorage.setItem('citronela_crops', JSON.stringify(updated));
    if (selectedCrop?.id === id) {
      setSelectedCrop(updated[0] || null);
    }
    showNotification('Bucket eliminado');
  };

  const updateBucket = () => {
    if (!editingCrop) return;
    const updated = crops.map((c) => (c.id === editingCrop.id ? { ...c, ...editingCrop } : c));
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
    const log = { id: Date.now(), ...newLog, cropId: selectedCrop.id };
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
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    localStorage.setItem('citronela_logs', JSON.stringify(updated));
    showNotification('Registro eliminado');
  };

  const cropLogs = logs.filter((l) => l.cropId === selectedCrop?.id).sort((a, b) => b.id - a.id);

  const calculateNutrients = () => {
    const { grow, micro, bloom, water } = calculator;
    return {
      growMl: (grow * water).toFixed(0),
      microMl: (micro * water).toFixed(0),
      bloomMl: (bloom * water).toFixed(0),
      waterLt: water,
    };
  };

  return (
    <div className="min-h-screen bg-[#07120b]">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-lime-400 text-[#07120b] px-6 py-3 rounded-lg shadow-lg z-50 font-medium text-sm">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/[0.02] backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-zinc-400 hover:text-lime-400 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </button>
            <div className="h-6 w-px bg-white/[0.08]" />
            <h1 className="text-xl font-bold text-zinc-100">Mis Cultivos</h1>
          </div>
          <button
            onClick={() => setShowNewBucket(true)}
            className="bg-lime-400 text-[#07120b] px-5 py-2.5 rounded-xl hover:bg-lime-300 transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Bucket
          </button>
        </div>
      </header>

      {/* New Bucket Modal */}
      {showNewBucket && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#07120b] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-zinc-50 mb-4">Nuevo Bucket</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  value={newBucket.bucketName}
                  onChange={(e) => setNewBucket({ ...newBucket, bucketName: e.target.value })}
                  placeholder="Nombre del cultivo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fase</label>
                <select
                  value={newBucket.phase}
                  onChange={(e) => setNewBucket({ ...newBucket, phase: e.target.value })}
                  className={inputClass}
                >
                  {PHASES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select
                  value={newBucket.status}
                  onChange={(e) => setNewBucket({ ...newBucket, status: e.target.value })}
                  className={inputClass}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewBucket(false)}
                className="flex-1 border border-white/[0.08] text-zinc-300 px-4 py-2 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addBucket}
                className="flex-1 bg-lime-400 text-[#07120b] px-4 py-2 rounded-xl hover:bg-lime-300 font-semibold transition-colors"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Crop Modal */}
      {editingCrop && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#07120b] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-zinc-50 mb-4">Editar Bucket</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  value={editingCrop.bucketName}
                  onChange={(e) => setEditingCrop({ ...editingCrop, bucketName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fase</label>
                <select
                  value={editingCrop.phase}
                  onChange={(e) => setEditingCrop({ ...editingCrop, phase: e.target.value })}
                  className={inputClass}
                >
                  {PHASES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select
                  value={editingCrop.status}
                  onChange={(e) => setEditingCrop({ ...editingCrop, status: e.target.value })}
                  className={inputClass}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCrop.ph}
                    onChange={(e) => setEditingCrop({ ...editingCrop, ph: parseFloat(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>EC</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCrop.ec}
                    onChange={(e) => setEditingCrop({ ...editingCrop, ec: parseFloat(e.target.value) })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCrop(null)}
                className="flex-1 border border-white/[0.08] text-zinc-300 px-4 py-2 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={updateBucket}
                className="flex-1 bg-lime-400 text-[#07120b] px-4 py-2 rounded-xl hover:bg-lime-300 font-semibold transition-colors"
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
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-lime-400/5 border border-lime-400/10 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-lime-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707" />
                <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">Sin cultivos todavía</h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">Crea tu primer bucket para empezar a registrar el progreso de tus plantas</p>
            <button
              onClick={() => setShowNewBucket(true)}
              className="bg-lime-400 text-[#07120b] px-8 py-3 rounded-xl hover:bg-lime-300 transition-colors font-semibold"
            >
              Crear Primer Bucket
            </button>
          </div>
        )}

        {/* Crops Grid */}
        {crops.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {crops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`bg-white/[0.03] p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 relative group ${
                  selectedCrop?.id === crop.id
                    ? 'border-lime-400/50 ring-1 ring-lime-400/20'
                    : 'border-white/[0.08] hover:border-lime-400/30'
                }`}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingCrop(crop); }}
                    className="w-8 h-8 bg-white/[0.06] hover:bg-lime-400/10 rounded-lg flex items-center justify-center text-zinc-500 hover:text-lime-400 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => deleteBucket(crop.id, e)}
                    className="w-8 h-8 bg-white/[0.06] hover:bg-red-500/10 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-zinc-100">{crop.bucketName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[crop.status] ?? 'bg-white/[0.06] text-zinc-400'}`}>
                    {crop.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>Fase: {crop.phase}</p>
                  <p>pH: {crop.ph} | EC: {crop.ec}</p>
                  <p className="text-xs text-zinc-600">Desde: {crop.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Crop Details */}
        {selectedCrop && crops.length > 0 && (
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08]">
            <div className="p-6 border-b border-white/[0.08] flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">{selectedCrop.bucketName}</h2>
                <p className="text-zinc-400 mt-0.5">{selectedCrop.phase} · pH: {selectedCrop.ph} · EC: {selectedCrop.ec}</p>
                <p className="text-sm text-zinc-600 mt-1">Creado: {selectedCrop.createdAt}</p>
              </div>
              <button
                onClick={() => setShowCalculator((v) => !v)}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-lime-400 hover:border-lime-400/30 px-4 py-2 rounded-xl transition-colors text-sm"
              >
                <FlaskConical className="w-4 h-4" />
                Calculadora
              </button>
            </div>

            {/* Calculator Panel */}
            {showCalculator && (
              <div className="p-6 border-b border-white/[0.08] bg-lime-400/[0.02]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-lime-400" />
                    Calculadora de Nutrientes
                  </h3>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  {(['grow', 'micro', 'bloom'] as const).map((key) => (
                    <div key={key}>
                      <label className={labelClass}>{key.charAt(0).toUpperCase() + key.slice(1)} (ml/L)</label>
                      <input
                        type="number"
                        value={calculator[key]}
                        onChange={(e) => setCalculator({ ...calculator, [key]: parseFloat(e.target.value) })}
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Agua (L)</label>
                    <input
                      type="number"
                      value={calculator.water}
                      onChange={(e) => setCalculator({ ...calculator, water: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-lime-400/10 p-4 rounded-xl text-center">
                    <p className="text-sm text-lime-400/70">Grow Total</p>
                    <p className="text-2xl font-bold text-lime-400">{calculateNutrients().growMl}ml</p>
                  </div>
                  <div className="bg-blue-400/10 p-4 rounded-xl text-center">
                    <p className="text-sm text-blue-400/70">Micro Total</p>
                    <p className="text-2xl font-bold text-blue-400">{calculateNutrients().microMl}ml</p>
                  </div>
                  <div className="bg-purple-400/10 p-4 rounded-xl text-center">
                    <p className="text-sm text-purple-400/70">Bloom Total</p>
                    <p className="text-2xl font-bold text-purple-400">{calculateNutrients().bloomMl}ml</p>
                  </div>
                  <div className="bg-white/[0.04] p-4 rounded-xl text-center">
                    <p className="text-sm text-zinc-500">Agua</p>
                    <p className="text-2xl font-bold text-zinc-300">{calculateNutrients().waterLt}L</p>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Logs */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-zinc-100">Registros Semanales</h3>
                <button
                  onClick={() => {
                    setNewLog({ ...newLog, phase: selectedCrop.phase });
                    setShowAddLog(true);
                  }}
                  className="flex items-center gap-1 text-sm text-lime-400 hover:text-lime-300 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Registro
                </button>
              </div>

              {cropLogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <p>No hay registros todavía</p>
                  <button
                    onClick={() => setShowAddLog(true)}
                    className="text-lime-400 hover:underline mt-2 text-sm"
                  >
                    Agregar primer registro
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Semana</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Fase</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">pH</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">EC</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Grow</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Micro</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Bloom</th>
                        <th className="text-left py-3 px-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {cropLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4 text-zinc-100">{log.week}</td>
                          <td className="py-3 px-4 text-zinc-300">{log.phase}</td>
                          <td className="py-3 px-4 text-zinc-300">{log.ph}</td>
                          <td className="py-3 px-4 text-zinc-300">{log.ec}</td>
                          <td className="py-3 px-4 text-zinc-300">{log.grow}ml</td>
                          <td className="py-3 px-4 text-zinc-300">{log.micro}ml</td>
                          <td className="py-3 px-4 text-zinc-300">{log.bloom}ml</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => deleteLog(log.id, e)}
                              className="text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add Log inline panel */}
            {showAddLog && (
              <div className="p-6 border-t border-white/[0.08] bg-white/[0.02]">
                <h4 className="font-semibold text-zinc-100 mb-4">Nuevo Registro</h4>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Semana</label>
                    <input
                      type="text"
                      value={newLog.week}
                      onChange={(e) => setNewLog({ ...newLog, week: e.target.value })}
                      placeholder="ej: Semana 5"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Fase</label>
                    <select
                      value={newLog.phase}
                      onChange={(e) => setNewLog({ ...newLog, phase: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Seleccionar</option>
                      {PHASES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newLog.ph}
                      onChange={(e) => setNewLog({ ...newLog, ph: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>EC</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newLog.ec}
                      onChange={(e) => setNewLog({ ...newLog, ec: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Grow (ml/L)</label>
                    <input
                      type="number"
                      value={newLog.grow}
                      onChange={(e) => setNewLog({ ...newLog, grow: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Micro (ml/L)</label>
                    <input
                      type="number"
                      value={newLog.micro}
                      onChange={(e) => setNewLog({ ...newLog, micro: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bloom (ml/L)</label>
                    <input
                      type="number"
                      value={newLog.bloom}
                      onChange={(e) => setNewLog({ ...newLog, bloom: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddLog(false)}
                    className="border border-white/[0.08] text-zinc-300 px-4 py-2 rounded-xl hover:bg-white/[0.04] transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addLog}
                    className="bg-lime-400 text-[#07120b] px-4 py-2 rounded-xl hover:bg-lime-300 font-semibold transition-colors text-sm"
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
