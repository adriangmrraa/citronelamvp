'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  url: string;
  filename: string;
  label?: string;
}

export default function ExportButton({ url, filename, label = 'Exportar CSV' }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al exportar');
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al descargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      {loading ? (
        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-1.5" />
      )}
      {label}
    </Button>
  );
}
