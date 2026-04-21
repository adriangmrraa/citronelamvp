'use client';

import { useState } from 'react';
import Link from 'next/link';

// Demo data
const DEMO_CROPS = [
  { id: 1, bucketName: 'Gorilla Glue', status: 'Verde', phase: 'Floracion', ph: 6.2, ec: 1.8, imageUrl: null },
  { id: 2, bucketName: 'Blue Dream', status: 'Amarillo', phase: 'Vegetacion', ph: 6.5, ec: 1.4, imageUrl: null },
  { id: 3, bucketName: 'Sour Diesel', status: 'Verde', phase: 'Germinacion', ph: 6.0, ec: 1.0, imageUrl: null },
];

const DEMO_LOGS = [
  { id: 1, week: 'Semana 12', phase: 'Floracion', ph: 6.2, ec: 1.8, grow: 15, micro: 10, bloom: 20, cropId: 1 },
  { id: 2, week: 'Semana 11', phase: 'Floracion', ph: 6.3, ec: 1.7, grow: 14, micro: 9, bloom: 18, cropId: 1 },
  { id: 3, week: 'Semana 10', phase: 'Transicion', ph: 6.4, ec: 1.5, grow: 12, micro: 8, bloom: 15, cropId: 1 },
];

export default function CropsPage() {
  const [crops] = useState(DEMO_CROPS);
  const [logs] = useState(DEMO_LOGS);
  const [selectedCrop, setSelectedCrop] = useState(DEMO_CROPS[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-100 text-green-800';
      case 'Amarillo': return 'bg-yellow-100 text-yellow-800';
      case 'Rojo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-green-600 hover:text-green-700">← Volver</Link>
            <h1 className="text-2xl font-bold text-green-800">🌱 Mis Cultivos</h1>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + Nuevo Bucket
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Crops Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`bg-white p-6 rounded-lg shadow cursor-pointer transition ${
                selectedCrop?.id === crop.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{crop.bucketName}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(crop.status)}`}>
                  {crop.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Fase: {crop.phase}</p>
                <p>pH: {crop.ph} | EC: {crop.ec}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Crop Details */}
        {selectedCrop && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedCrop.bucketName}</h2>
              <p className="text-gray-600">{selectedCrop.phase} • pH: {selectedCrop.ph} • EC: {selectedCrop.ec}</p>
            </div>

            {/* Weekly Logs */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">📊 Registros Semanales</h3>
                <button className="text-green-600 hover:text-green-700">+ Agregar Registro</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Semana</th>
                      <th className="text-left py-3 px-4">Fase</th>
                      <th className="text-left py-3 px-4">pH</th>
                      <th className="text-left py-3 px-4">EC</th>
                      <th className="text-left py-3 px-4">Grow</th>
                      <th className="text-left py-3 px-4">Micro</th>
                      <th className="text-left py-3 px-4">Bloom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.filter(l => l.cropId === selectedCrop.id).map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{log.week}</td>
                        <td className="py-3 px-4">{log.phase}</td>
                        <td className="py-3 px-4">{log.ph}</td>
                        <td className="py-3 px-4">{log.ec}</td>
                        <td className="py-3 px-4">{log.grow}ml</td>
                        <td className="py-3 px-4">{log.micro}ml</td>
                        <td className="py-3 px-4">{log.bloom}ml</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nutrient Calculator */}
            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold mb-4">🧪 Calculadora de Nutrientes</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Grow</p>
                  <p className="text-2xl font-bold">15ml/L</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Micro</p>
                  <p className="text-2xl font-bold">10ml/L</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Bloom</p>
                  <p className="text-2xl font-bold">20ml/L</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Agua</p>
                  <p className="text-2xl font-bold">20L</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}