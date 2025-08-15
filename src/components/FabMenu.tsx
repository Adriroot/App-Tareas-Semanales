// Archivo: src/components/FabMenu.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React, { useState, useRef, useEffect } from 'react';
import { ShareIcon, Cog8ToothIcon, BookmarkSquareIcon, CalendarEditIcon, ArrowPathIcon, Squares2X2Icon, XMarkIcon, HomeIcon, UsersIcon } from './icons';

interface FabMenuProps {
  onInvite: () => void;
  onSettings: () => void;
  onTemplates: () => void;
  onEditDate: () => void;
  onResetWeek: () => void;
  onManageHousehold: () => void;
  onJoinHousehold: () => void;
}

const FabMenu: React.FC<FabMenuProps> = ({ onInvite, onSettings, onTemplates, onEditDate, onResetWeek, onManageHousehold, onJoinHousehold }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: ShareIcon, label: 'Invitar', action: onInvite },
    { icon: UsersIcon, label: 'Unirse a Hogar', action: onJoinHousehold },
    { icon: HomeIcon, label: 'Gestionar Hogar', action: onManageHousehold },
    { icon: Cog8ToothIcon, label: 'Ajustes', action: onSettings },
    { icon: BookmarkSquareIcon, label: 'Plantillas', action: onTemplates },
    { icon: CalendarEditIcon, label: 'Editar Fecha', action: onEditDate },
    { icon: ArrowPathIcon, label: 'Reiniciar Semana', action: onResetWeek },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Elementos del menú con animación de entrada */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-2 animate-fade-in">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  console.log('FAB Menu item clicked:', item.label);
                  item.action();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 bg-[var(--card)] border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-xl shadow-card min-w-[140px] active:scale-95"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5 flex-shrink-0 text-[var(--primary)]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Botón principal mejorado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-95 ${
          isOpen ? 'rotate-45' : ''
        }`}
        style={{ transition: 'transform 0.2s ease' }}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? (
          <XMarkIcon className="w-7 h-7" />
        ) : (
          <Squares2X2Icon className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default FabMenu;