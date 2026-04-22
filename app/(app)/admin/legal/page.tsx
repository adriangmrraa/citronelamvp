'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, FileText } from 'lucide-react';

interface LegalSection {
  type: 'terms' | 'privacy';
  content: string;
}

interface SectionEditorProps {
  label: string;
  type: 'terms' | 'privacy';
  initialContent: string;
}

function SectionEditor({ label, type, initialContent }: SectionEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
          {label}
        </h2>
        <Button size="sm" onClick={handleSave} disabled={loading}>
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {loading ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
          Contenido guardado correctamente.
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y font-mono"
        placeholder="Ingresá el contenido..."
      />

      <p className="text-xs text-gray-400">{content.length} caracteres</p>
    </div>
  );
}

export default function AdminLegalPage() {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/legal');
        const data = await res.json();
        setSections(data.sections ?? []);
      } catch {
        // fallback to empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getContent = (type: 'terms' | 'privacy') =>
    sections.find((s) => s.type === type)?.content ?? '';

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Cargando contenido legal...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contenido legal</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Editá los términos y la política de privacidad de la plataforma.
        </p>
      </div>

      <SectionEditor
        label="Términos y Condiciones"
        type="terms"
        initialContent={getContent('terms')}
      />

      <SectionEditor
        label="Política de Privacidad"
        type="privacy"
        initialContent={getContent('privacy')}
      />
    </div>
  );
}
