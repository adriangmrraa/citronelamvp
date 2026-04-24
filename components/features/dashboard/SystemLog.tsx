'use client';

const logs = [
  {
    time: '2024-05-24 14:32:01',
    sensor: 'SNSR-09-PH',
    component: 'Tanque Alpha',
    action: 'Ciclo Auto-Ajuste de pH',
    status: 'COMPLETADO'
  },
  {
    time: '2024-05-24 14:15:44',
    sensor: 'SNSR-12-LGT',
    component: 'Zona Blue Dream',
    action: 'Cambio de Espectro: Floración',
    status: 'COMPLETADO'
  },
  {
    time: '2024-05-24 13:50:12',
    sensor: 'NET-SYS-01',
    component: 'Hub Central',
    action: 'Handshake Base de Datos Externa',
    status: 'PENDIENTE'
  }
];

export function SystemLog() {
  return (
    <section className="glass-surface rounded-2xl overflow-hidden mt-12">
      <div className="px-8 py-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/20">
        <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Log del Sistema & Archivo Técnico</h2>
        <span className="text-primary text-[10px] font-sans flex items-center gap-2 uppercase tracking-widest">
          Feed en Tiempo Real <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-widest text-zinc-500">Timestamp</th>
              <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-widest text-zinc-500">ID Sensor</th>
              <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-widest text-zinc-500">Componente</th>
              <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-widest text-zinc-500">Acción</th>
              <th className="px-8 py-4 font-sans text-[10px] uppercase tracking-widest text-zinc-500 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-primary/5 transition-colors group">
                <td className="px-8 py-4 text-xs font-mono text-zinc-500">{log.time}</td>
                <td className="px-8 py-4 text-xs font-mono text-zinc-300">{log.sensor}</td>
                <td className="px-8 py-4 text-xs font-sans italic text-zinc-400">{log.component}</td>
                <td className="px-8 py-4 text-xs font-sans text-zinc-300">{log.action}</td>
                <td className="px-8 py-4 text-right">
                  <span className={`text-[9px] font-sans font-bold px-2 py-1 rounded border ${
                    log.status === 'COMPLETADO' 
                      ? 'text-primary bg-primary/10 border-primary/20' 
                      : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
