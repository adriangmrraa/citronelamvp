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
    <div className="space-y-3 p-5 border border-white/[0.08] rounded-2xl bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-lime-400" />
          {label}
        </h2>
        <Button size="sm" onClick={handleSave} disabled={loading}>
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {loading ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-lime-400/10 border border-lime-400/20 text-lime-400 p-3 rounded-lg text-sm">
          Contenido guardado correctamente.
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="w-full px-3 py-2.5 text-sm border border-white/[0.08] rounded-lg bg-white/[0.04] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 resize-y font-mono"
        placeholder="Ingresá el contenido..."
      />

      <p className="text-xs text-zinc-500">{content.length} caracteres</p>
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
    return <div className="p-6 text-center text-zinc-500">Cargando contenido legal...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Contenido legal</h1>
        <p className="text-zinc-400 mt-1">
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
