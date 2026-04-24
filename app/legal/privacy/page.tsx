import { ShieldCheck } from 'lucide-react';
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

const FALLBACK_PRIVACY = `En Citronela, la privacidad de nuestros socios es fundamental. Esta política describe cómo recopilamos, usamos y protegemos tu información.

1. INFORMACIÓN QUE RECOPILAMOS
- Información de registro: nombre de usuario, email, documentación de verificación
- Información de uso: actividad en la plataforma, transacciones, publicaciones
- Información técnica: dirección IP, tipo de dispositivo, navegador

2. USO DE LA INFORMACIÓN
Usamos tu información para:
- Verificar tu identidad y gestionar tu cuenta
- Procesar transacciones de tokens
- Enviarte notificaciones relevantes
- Mejorar la experiencia en la plataforma

3. COMPARTIR INFORMACIÓN
No vendemos ni compartimos tu información personal con terceros, excepto cuando sea requerido por ley.

4. SEGURIDAD
Implementamos medidas de seguridad estándar de la industria para proteger tu información.

5. TUS DERECHOS
Podés solicitar acceso, corrección o eliminación de tu información personal contactándonos.

6. COOKIES
Usamos cookies esenciales para el funcionamiento de la plataforma.

Para ejercer tus derechos o hacer consultas, contactá al equipo de Citronela.`;

export default async function PrivacyPage() {
  const content = await getLegalContent('privacy');
  const displayContent = content || FALLBACK_PRIVACY;

  return (
    <div className="min-h-screen bg-[#07120b]">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Política de Privacidad</h1>
            <p className="text-sm text-zinc-400">Plataforma Citronela</p>
          </div>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6 md:p-8">
          <div className="prose prose-sm max-w-none text-zinc-300">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{displayContent}</pre>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-zinc-500">
          <Link href="/legal/terms" className="hover:text-lime-400 transition-colors">
            Términos y Condiciones
          </Link>
          <span>·</span>
          <Link href="/" className="hover:text-lime-400 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
