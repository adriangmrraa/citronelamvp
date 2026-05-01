'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Calculator, 
  Pencil, 
  Trash2, 
  Plus, 
  Settings, 
  Zap, 
  Droplets, 
  Thermometer, 
  Activity,
  History,
  Beaker,
  ShieldCheck,
  AlertCircle,
  Wind,
  Sun,
  Waves,
  Cpu,
  BarChart3
} from 'lucide-react';
import type { Crop, CropLog, LabReport } from '@/db/schema';
import CropForm from '@/components/crops/CropForm';
import LogTable from '@/components/crops/LogTable';
import LogForm from '@/components/crops/LogForm';
import LabReportCard from '@/components/crops/LabReportCard';
import LabReportForm from '@/components/crops/LabReportForm';
import NutrientCalculator from '@/components/crops/NutrientCalculator';
import { Button } from '@/components/ui/button';

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-lime-400/10 text-lime-400 border-lime-400/20',
  Amarillo: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  Rojo: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_OPTIONS = ['Verde', 'Amarillo', 'Rojo'] as const;

const MOCK_CROP_DATA: Record<string, any> = {
  "42": {
    bucketName: "Amnesia Haze",
    cultivationMethod: "Hidroponía DWC",
    status: "Verde",
    imageUrl: "/images/dashboard/2.png"
  },
  "39": {
    bucketName: "Blue Dream",
    cultivationMethod: "Sustrato Orgánico",
    status: "Verde",
    imageUrl: "/images/dashboard/3.png"
  },
  "41": {
    bucketName: "OG Kush",
    cultivationMethod: "Hidroponía NFT",
    status: "Amarillo",
    imageUrl: "/images/dashboard/4.png"
  }
};

const SimpleTrendChart = ({ color, data }: { color: string, data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-16 w-full opacity-60 group-hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill={`url(#grad-${color})`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
      </svg>
    </div>
  );
};

export default function CropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cropId = params.id as string;

  const [crop, setCrop] = useState<any | null>(null);
  const [logs, setLogs] = useState<CropLog[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'lab' | 'sensors'>('logs');

  const [showEditCrop, setShowEditCrop] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showLabForm, setShowLabForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [deletingCrop, setDeletingCrop] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crops/${cropId}`);
      if (res.ok) {
        const data = await res.json();
        setCrop(data.crop);
        setLogs(data.logs);
        setLabReports(data.labReports);
      } else {
        // Fallback a Mock si la API falla
        const mock = MOCK_CROP_DATA[cropId] || MOCK_CROP_DATA["42"];
        setCrop(mock);
        setLogs([]);
        setLabReports([]);
      }
    } catch {
       const mock = MOCK_CROP_DATA[cropId] || MOCK_CROP_DATA["42"];
       setCrop(mock);
    } finally {
      setLoading(false);
    }
  }, [cropId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDeleteCrop() {
    if (!confirm('¿Eliminar esta parcela y todos sus registros?')) return;
    setDeletingCrop(true);
    try {
      const res = await fetch(`/api/crops/${cropId}`, { method: 'DELETE' });
      if (res.ok) router.push('/cultivo');
    } catch {
      setError('Error al eliminar');
    } finally {
      setDeletingCrop(false);
    }
  }

  async function handleDeleteLog(logId: number) {
    try {
      const res = await fetch(`/api/crops/${cropId}/logs/${logId}`, { method: 'DELETE' });
      if (res.ok) setLogs((prev) => prev.filter((l) => l.id !== logId));
    } catch {
      setError('Error al eliminar registro');
    }
  }

  async function handleDeleteReport(reportId: number) {
    try {
      const res = await fetch(`/api/crops/${cropId}/lab-reports/${reportId}`, { method: 'DELETE' });
      if (res.ok) setLabReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setError('Error al eliminar reporte');
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!crop || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setCrop(data.crop);
      } else {
        setCrop({ ...crop, status: newStatus });
      }
    } catch {
      setCrop({ ...crop, status: newStatus });
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#07120b] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!crop) return (
    <div className="min-h-screen bg-[#07120b] flex flex-col items-center justify-center text-white gap-4">
      <AlertCircle className="w-12 h-12 opacity-20" />
      <p className="text-xl font-medium opacity-50">Cultivo no encontrado</p>
      <Button onClick={() => router.push('/cultivo')} variant="outline" className="border-white/10">
        Volver a mis cultivos
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen text-zinc-100 pb-24 font-sans bg-transparent">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 bg-[#07120b]/80 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <button 
          onClick={() => router.push('/cultivo')}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#A3E635] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Mis Cultivos
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowCalculator(v => !v)} className="p-2 text-zinc-400 hover:text-[#A3E635] transition-colors">
            <Calculator className="w-5 h-5" />
          </button>
          <button onClick={() => setShowEditCrop(true)} className="p-2 text-zinc-400 hover:text-[#A3E635] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-[2000px] mx-auto px-6 pt-8 space-y-12">
        {/* Top Grid: Feed & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Live Feed */}
          <div className="space-y-6">
            <div className="relative aspect-video w-full bg-black rounded-none overflow-hidden border border-white/5 shadow-2xl group">
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest shadow-sm">REC ● LIVE</span>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/40">
                  CAM_01 // SEC_{cropId.padStart(3, '0')}
                </div>
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/40">
                  {new Date().toISOString().split('T')[0]} // {new Date().toLocaleTimeString()}
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
              </div>

              {crop.imageUrl ? (
                <img
                  src={crop.imageUrl}
                  alt={crop.bucketName}
                  className="w-full h-full object-cover grayscale-[20%] contrast-125"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <Activity className="w-12 h-12 text-zinc-800 animate-pulse" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <Button variant="outline" className="border-white/20 text-white rounded-none tracking-widest uppercase text-xs font-black">
                  PANTALLA COMPLETA
                </Button>
              </div>
            </div>

            {/* Manual Controls */}
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-white/[0.02] border border-white/5 p-4 flex flex-col items-center gap-2 hover:bg-[#A3E635]/10 hover:border-[#A3E635]/20 transition-all group">
                <Droplets className="w-5 h-5 text-zinc-500 group-hover:text-[#A3E635]" />
                <span className="text-[10px] font-black text-zinc-500 group-hover:text-[#A3E635] uppercase tracking-widest">Riego Manual</span>
              </button>
              <button className="bg-white/[0.02] border border-white/5 p-4 flex flex-col items-center gap-2 hover:bg-[#A3E635]/10 hover:border-[#A3E635]/20 transition-all group">
                <Zap className="w-5 h-5 text-zinc-500 group-hover:text-[#A3E635]" />
                <span className="text-[10px] font-black text-zinc-500 group-hover:text-[#A3E635] uppercase tracking-widest">Luz UV</span>
              </button>
              <button className="bg-white/[0.02] border border-white/5 p-4 flex flex-col items-center gap-2 hover:bg-[#A3E635]/10 hover:border-[#A3E635]/20 transition-all group">
                <Thermometer className="w-5 h-5 text-zinc-500 group-hover:text-[#A3E635]" />
                <span className="text-[10px] font-black text-zinc-500 group-hover:text-[#A3E635] uppercase tracking-widest">Vent</span>
              </button>
            </div>
          </div>

          {/* Right Column: Telemetry */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                Monitorización Hidropónica  |  Sistema Operativo
              </p>
              <div className={`px-3 py-1 rounded-sm border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[crop.status] || STATUS_STYLES.Verde}`}>
                {crop.status}
              </div>
            </div>

            <div className="space-y-2">
              <h1 style={{ fontFamily: 'var(--font-avigea)' }} className="text-4xl md:text-6xl text-white tracking-wide leading-[1.1]">
                {crop.bucketName}
              </h1>
              <p className="text-[#A3E635] text-xs font-black uppercase tracking-[0.2em]">
                {crop.cultivationMethod}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-y-10 gap-x-6 py-8 border-y border-white/5">
              {[
                { label: 'PH', value: '6.2', unit: '' },
                { label: 'EC', value: '1.8', unit: 'ms/cm' },
                { label: 'DÍA', value: '45', unit: '/70' },
                { label: 'TEMP', value: '24.5', unit: '°C' },
                { label: 'HUM', value: '65', unit: '%' },
                { label: 'AGUA', value: '88', unit: '%' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white tracking-tighter">{stat.value}</span>
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-tight">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra KPIs Row */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'VPD', value: '1.2', icon: Waves, unit: 'kPa', color: 'text-blue-400' },
                { label: 'PAR', value: '850', icon: Sun, unit: 'µmol', color: 'text-amber-400' },
                { label: 'CO2', value: '420', icon: Wind, unit: 'ppm', color: 'text-emerald-400' },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white/[0.02] border border-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{kpi.label}</span>
                  </div>
                  <p className="text-xl font-black text-white">{kpi.value}<span className="text-[10px] font-medium text-zinc-600 ml-1 uppercase">{kpi.unit}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics & Automation Section */}
        <section className="space-y-8 pt-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#A3E635]" />
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Bio-Analytic Data Engine</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart 1: PH/EC Tendency */}
            <div className="bg-white/[0.02] border border-white/5 p-6 space-y-6 group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Tendencia PH/EC</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-medium">Últimas 24 horas</p>
                </div>
                <Activity className="w-4 h-4 text-[#A3E635]/40" />
              </div>
              <SimpleTrendChart color="#A3E635" data={[6.2, 6.1, 6.3, 6.2, 6.0, 6.2, 6.3, 6.2]} />
              <div className="flex justify-between text-[10px] font-black text-zinc-500">
                <span>00:00</span>
                <span className="text-white">ESTABLE</span>
                <span>23:59</span>
              </div>
            </div>

            {/* Chart 2: Env Tendency */}
            <div className="bg-white/[0.02] border border-white/5 p-6 space-y-6 group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Clima Interno</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-medium">Temperatura Promedio</p>
                </div>
                <Thermometer className="w-4 h-4 text-orange-400/40" />
              </div>
              <SimpleTrendChart color="#fb923c" data={[22, 24, 25, 24.5, 23, 24, 25, 24.5]} />
              <div className="flex justify-between text-[10px] font-black text-zinc-500">
                <span>-24H</span>
                <span className="text-orange-400">+1.2°C ▲</span>
                <span>AHORA</span>
              </div>
            </div>

            {/* Automation Panel */}
            <div className="bg-[#A3E635]/5 border border-[#A3E635]/10 p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#A3E635]" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Actuadores Activos</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Bomba de Nutrientes', status: 'Activo', color: 'bg-[#A3E635]' },
                  { name: 'Inyector de CO2', status: 'Stand-by', color: 'bg-zinc-700' },
                  { name: 'Sistema de Humedad', status: 'Activo', color: 'bg-[#A3E635]' },
                ].map((act) => (
                  <div key={act.name} className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{act.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-white uppercase">{act.status}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${act.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs & Deep Data Section */}
        <div className="pt-16 space-y-8">
          <div className="flex gap-8 border-b border-white/5 overflow-x-auto no-scrollbar">
            {[
              { id: 'logs', label: 'HISTORIAL DE LOGS', icon: History },
              { id: 'lab', label: 'REPORTES LAB', icon: Beaker },
              { id: 'sensors', label: 'RED DE SENSORES', icon: Cpu },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-[#A3E635] text-white' : 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="min-h-[400px]">
            {activeTab === 'logs' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{logs.length} Registros encontrados</p>
                  <Button 
                    onClick={() => setShowLogForm(true)}
                    className="bg-[#A3E635] text-[#07120b] hover:bg-[#b4f346] font-black rounded-none text-[10px] tracking-widest uppercase h-9 px-4"
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    NUEVO REGISTRO
                  </Button>
                </div>
                <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
                  <LogTable logs={logs} onDelete={handleDeleteLog} />
                </div>
              </div>
            ) : activeTab === 'lab' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{labReports.length} Reportes analizados</p>
                  <Button 
                    onClick={() => setShowLabForm(true)}
                    className="border border-[#A3E635] text-[#A3E635] hover:bg-[#A3E635]/10 font-black rounded-none text-[10px] tracking-widest uppercase h-9 px-4"
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    SOLICITAR ANÁLISIS
                  </Button>
                </div>
                {labReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/5">
                    <Beaker className="w-12 h-12 text-zinc-800 mb-4" />
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">No hay reportes vinculados</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {labReports.map((report) => (
                      <LabReportCard key={report.id} report={report} onDelete={handleDeleteReport} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Sonda PH v2', status: 'Online', battery: '98%', signal: 'Excellent' },
                    { name: 'Sensor Humedad Suelo', status: 'Online', battery: '82%', signal: 'Good' },
                    { name: 'Estación Climática', status: 'Online', battery: '100%', signal: 'Excellent' },
                    { name: 'Controlador CO2', status: 'Offline', battery: '0%', signal: 'None' },
                  ].map(sensor => (
                    <div key={sensor.name} className="bg-white/[0.02] border border-white/5 p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{sensor.name}</h4>
                        <div className={`w-2 h-2 rounded-full ${sensor.status === 'Online' ? 'bg-[#A3E635]' : 'bg-red-500'}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-medium text-zinc-500 uppercase">
                         <span>Batería: <span className="text-white">{sensor.battery}</span></span>
                         <span>Señal: <span className="text-white">{sensor.signal}</span></span>
                      </div>
                    </div>
                  ))}
               </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#07120b]/90 backdrop-blur-sm">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-[#07120b] border border-white/10 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white tracking-widest uppercase">Calculadora de Nutrientes</h3>
              <button onClick={() => setShowCalculator(false)} className="text-zinc-500 hover:text-white">
                <ChevronLeft className="w-6 h-6 rotate-90" />
              </button>
            </div>
            <NutrientCalculator />
          </div>
        </div>
      )}

      {showEditCrop && (
        <CropForm
          crop={crop}
          onSuccess={(updated) => {
            setCrop(updated);
            setShowEditCrop(false);
          }}
          onCancel={() => setShowEditCrop(false)}
        />
      )}

      {showLogForm && (
        <LogForm
          cropId={cropId}
          onSuccess={(log) => {
            setLogs((prev) => [log, ...prev]);
            setShowLogForm(false);
          }}
          onCancel={() => setShowLogForm(false)}
        />
      )}

      {showLabForm && (
        <LabReportForm
          cropId={cropId}
          onSuccess={(report) => {
            setLabReports((prev) => [report, ...prev]);
            setShowLabForm(false);
          }}
          onCancel={() => setShowLabForm(false)}
        />
      )}
    </div>
  );
}
