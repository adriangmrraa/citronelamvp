import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTrendingEvents } from '../hooks/useEvents';

// Mock de React si es necesario, pero renderHook debería manejarlo
describe('useTrendingEvents', () => {
  it('debe filtrar eventos por término de búsqueda', async () => {
    const { result, rerender } = renderHook(({ searchTerm }) => useTrendingEvents(searchTerm), {
      initialProps: { searchTerm: '' }
    });

    // Inicialmente cargando
    expect(result.current.isLoading).toBe(true);

    // Esperar a que cargue la data inicial
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 2000 });
    expect(result.current.data.length).toBe(3);

    // Cambiar término de búsqueda
    rerender({ searchTerm: 'Terapia' });
    
    // Debe volver a cargar
    expect(result.current.isLoading).toBe(true);

    // Esperar al filtrado
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 2000 });
    
    // Solo debe quedar "Terapia Cannabica"
    expect(result.current.data.length).toBe(1);
    expect(result.current.data[0].title).toBe('Terapia Cannabica');
  });

  it('debe devolver array vacío si no hay coincidencias', async () => {
    const { result } = renderHook(() => useTrendingEvents('Inexistente'));

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 2000 });
    expect(result.current.data.length).toBe(0);
  });
});
