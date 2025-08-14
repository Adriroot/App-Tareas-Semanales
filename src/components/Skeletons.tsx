// Componentes skeleton para mejorar la percepción de velocidad
import React from 'react';

export const TaskListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-[var(--surface-1)] rounded-2xl animate-pulse">
        <div className="w-10 h-10 bg-[var(--surface-2)] rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--surface-2)] rounded w-3/4" />
          <div className="h-3 bg-[var(--surface-2)] rounded w-1/2" />
        </div>
        <div className="w-16 h-6 bg-[var(--surface-2)] rounded" />
      </div>
    ))}
  </div>
);

export const AddTaskFormSkeleton: React.FC = () => (
  <div className="p-6 bg-[var(--card)] rounded-2xl mb-6 animate-pulse">
    <div className="h-6 bg-[var(--surface-1)] rounded w-1/4 mb-4" />
    <div className="space-y-4">
      <div className="h-10 bg-[var(--surface-1)] rounded-lg" />
      <div className="flex gap-4">
        <div className="h-10 bg-[var(--surface-1)] rounded-lg flex-1" />
        <div className="h-10 bg-[var(--surface-1)] rounded-lg w-32" />
      </div>
      <div className="h-10 bg-[var(--surface-1)] rounded-lg w-24 ml-auto" />
    </div>
  </div>
);

export const StatsSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Tarjetas de resumen */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-[var(--card)] rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--surface-1)] rounded-lg" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-[var(--surface-1)] rounded w-2/3" />
              <div className="h-6 bg-[var(--surface-1)] rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Lista de usuarios */}
    <div className="bg-[var(--card)] rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-[var(--surface-1)] rounded w-1/4 mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-[var(--surface-1)] rounded-xl">
            <div className="w-8 h-8 bg-[var(--surface-2)] rounded-lg" />
            <div className="w-10 h-10 bg-[var(--surface-2)] rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--surface-2)] rounded w-1/3" />
              <div className="h-3 bg-[var(--surface-2)] rounded w-1/2" />
            </div>
            <div className="w-24 h-2 bg-[var(--surface-2)] rounded-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Gráfico */}
    <div className="bg-[var(--card)] rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-[var(--surface-1)] rounded w-1/4 mb-4" />
      <div className="h-64 bg-[var(--surface-1)] rounded-lg" />
    </div>
  </div>
);