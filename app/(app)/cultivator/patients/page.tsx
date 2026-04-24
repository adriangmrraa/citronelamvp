import PatientList from '@/components/cultivator/PatientList';

async function getPatients() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/cultivator/patients`, {
    cache: 'no-store',
  });

  if (res.status === 403) {
    return { forbidden: true, patients: [] };
  }

  if (!res.ok) {
    return { forbidden: false, patients: [] };
  }

  const data = await res.json();
  return { forbidden: false, patients: data.patients ?? [] };
}

export default async function CultivatorPatientsPage() {
  const { forbidden, patients } = await getPatients();

  if (forbidden) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-amber-400/10 border border-amber-400/20 text-amber-300 p-5 rounded-xl">
          <h2 className="font-semibold mb-1">Acceso restringido</h2>
          <p className="text-sm">
            Esta sección es solo para cultivadores. Si creés que es un error, contactá al administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Mis Pacientes</h1>
        <p className="text-zinc-400 mt-1">
          {patients.length} paciente{patients.length !== 1 ? 's' : ''} asignado{patients.length !== 1 ? 's' : ''}
        </p>
      </div>

      <PatientList patients={patients} />
    </div>
  );
}
