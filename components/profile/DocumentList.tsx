'use client';

import { FileText, Download } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
  status?: 'verified' | 'pending' | 'rejected';
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

const statusStyles: Record<string, string> = {
  verified: 'bg-lime-400/10 text-lime-400 border border-lime-400/20',
  pending: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const statusLabel: Record<string, string> = {
  verified: 'Verificado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
};

export default function DocumentList({ documents = [] }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="w-10 h-10 mx-auto mb-3 text-zinc-500 opacity-40" />
        <p className="text-sm text-zinc-500">No hay documentos cargados aún.</p>
        <div className="mt-6 border border-dashed border-white/[0.15] hover:border-lime-400/25 rounded-xl bg-white/[0.02] px-6 py-8 transition-colors cursor-pointer">
          <p className="text-sm text-zinc-500">Arrastrá un archivo o hacé clic para subir</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-zinc-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-zinc-100">{doc.name}</p>
              <p className="text-xs text-zinc-500">
                {new Date(doc.createdAt).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              {typeLabel[doc.type] ?? doc.type}
            </span>
            {doc.status && (
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusStyles[doc.status] ?? statusStyles.pending}`}>
                {statusLabel[doc.status] ?? doc.status}
              </span>
            )}
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-400 hover:text-lime-300 transition-colors"
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
