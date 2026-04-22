'use client';

import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: number;
  username: string;
  email: string | null;
  planType: string | null;
  assignedAt: string;
}

interface PatientListProps {
  patients: Patient[];
}

const planLabel: Record<string, string> = {
  basic: 'Básico',
  premium: 'Premium',
  vip: 'VIP',
};

export default function PatientList({ patients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-base font-medium mb-1">No tenés pacientes asignados</p>
        <p className="text-sm">Contactá al administrador para que te asigne pacientes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <Card key={patient.id}>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 dark:text-green-400 font-bold text-sm uppercase">
                  {patient.username.charAt(0)}
                </span>
              </div>
              {patient.planType && (
                <Badge variant="secondary">
                  {planLabel[patient.planType] ?? patient.planType}
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
              {patient.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {patient.email ?? 'Sin email'}
            </p>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              Asignado el{' '}
              {new Date(patient.assignedAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
