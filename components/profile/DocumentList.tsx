'use client';

import { FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

interface DocumentListProps {
  documents: Document[];
}

const typeLabel: Record<string, string> = {
  prescription: 'Receta',
  id: 'DNI',
  certificate: 'Certificado',
  other: 'Otro',
};

export default function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No hay documentos cargados aún.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(doc.createdAt).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {typeLabel[doc.type] ?? doc.type}
            </Badge>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              aria-label={`Descargar ${doc.name}`}
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
