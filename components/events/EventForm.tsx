'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2 } from 'lucide-react';

interface TicketCategoryInput {
  name: string;
  price: number;
  benefits: string;
  capacity: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  flyerUrl: string;
  requirements: string;
  ticketCategories: TicketCategoryInput[];
}

interface EventFormProps {
  eventId?: number;
  initialData?: Partial<EventFormData>;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultCategory = (): TicketCategoryInput => ({
  name: '',
  price: 0,
  benefits: '',
  capacity: '',
});

export default function EventForm({ eventId, initialData, onClose, onSuccess }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    date: initialData?.date ?? '',
    time: initialData?.time ?? '',
    location: initialData?.location ?? '',
    capacity: initialData?.capacity ?? '',
    flyerUrl: initialData?.flyerUrl ?? '',
    requirements: initialData?.requirements ?? '',
    ticketCategories: initialData?.ticketCategories ?? [defaultCategory()],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: keyof EventFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateCategory = (index: number, field: keyof TicketCategoryInput, value: string) => {
    setForm((f) => {
      const cats = [...f.ticketCategories];
      cats[index] = { ...cats[index], [field]: field === 'price' ? Number(value) : value };
      return { ...f, ticketCategories: cats };
    });
  };

  const addCategory = () => {
    setForm((f) => ({ ...f, ticketCategories: [...f.ticketCategories, defaultCategory()] }));
  };

  const removeCategory = (index: number) => {
    setForm((f) => ({
      ...f,
      ticketCategories: f.ticketCategories.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
        ticketCategories: form.ticketCategories.map((c) => ({
          ...c,
          price: Number(c.price),
          capacity: c.capacity ? Number(c.capacity) : null,
        })),
      };

      const url = eventId ? `/api/events/${eventId}` : '/api/events';
      const method = eventId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el evento');

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {eventId ? 'Editar evento' : 'Nuevo evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título *</label>
            <Input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Nombre del evento"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descripción del evento..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha *</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora</label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => updateField('time', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lugar</label>
              <Input
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Dirección o nombre del lugar"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacidad total</label>
              <Input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                placeholder="Sin límite"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL del flyer</label>
            <Input
              value={form.flyerUrl}
              onChange={(e) => updateField('flyerUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requisitos</label>
            <textarea
              value={form.requirements}
              onChange={(e) => updateField('requirements', e.target.value)}
              placeholder="Requisitos para asistir..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Ticket categories */}
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Categorías de entrada</h3>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar
              </Button>
            </div>

            {form.ticketCategories.map((cat, i) => (
              <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Categoría {i + 1}</span>
                  {form.ticketCategories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(i)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      aria-label="Eliminar categoría"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Nombre *</label>
                    <Input
                      value={cat.name}
                      onChange={(e) => updateCategory(i, 'name', e.target.value)}
                      placeholder="General"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Precio (tokens)</label>
                    <Input
                      type="number"
                      min="0"
                      value={cat.price}
                      onChange={(e) => updateCategory(i, 'price', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Cupos</label>
                    <Input
                      type="number"
                      min="1"
                      value={cat.capacity}
                      onChange={(e) => updateCategory(i, 'capacity', e.target.value)}
                      placeholder="Sin límite"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Beneficios</label>
                  <Input
                    value={cat.benefits}
                    onChange={(e) => updateCategory(i, 'benefits', e.target.value)}
                    placeholder="Incluye acceso VIP, bebidas..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : eventId ? 'Actualizar evento' : 'Crear evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
