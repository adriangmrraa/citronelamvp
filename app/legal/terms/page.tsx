import { FileText } from 'lucide-react';
import Link from 'next/link';

async function getLegalContent(type: 'terms' | 'privacy'): Promise<string> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/admin/legal`, { cache: 'no-store' });
    if (!res.ok) return '';
    const data = await res.json();
    const sections: Array<{ type: string; content: string }> = data.sections ?? [];
    return sections.find((s) => s.type === type)?.content ?? '';
  } catch {
    return '';
  }
}

const FALLBACK_TERMS = `Bienvenido a Citronela. Al usar nuestra plataforma, aceptás los siguientes términos y condiciones.

1. ACEPTACIÓN DE TÉRMINOS
Al acceder y usar la plataforma Citronela, aceptás estar sujeto a estos términos y condiciones de uso.

2. USO DE LA PLATAFORMA
La plataforma está destinada exclusivamente a socios verificados. El uso indebido puede resultar en la suspensión de tu cuenta.

3. TOKENS Y TRANSACCIONES
Los tokens son la moneda interna de la plataforma. Las transacciones son definitivas y no reembolsables.

4. PRIVACIDAD
Tu información personal está protegida según nuestra Política de Privacidad.

5. MODIFICACIONES
Nos reservamos el derecho de modificar estos términos con previo aviso.

Para consultas, contactá al equipo de Citronela.`;

export default async function TermsPage() {
  const content = await getLegalContent('terms');
  const displayContent = content || FALLBACK_TERMS;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plataforma Citronela</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{displayContent}</pre>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/legal/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Política de Privacidad
          </Link>
          <span>·</span>
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
