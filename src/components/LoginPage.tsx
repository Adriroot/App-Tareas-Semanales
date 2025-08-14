// Archivo: src/components/LoginPage.tsx - VERSIÓN FINAL Y COMPATIBLE

import React from 'react';

interface LoginPageProps {
  onSignIn: () => void;
  isSigningIn: boolean;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
  mousePosition: { x: number; y: number };
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignIn, isSigningIn, toggleTheme, theme, mousePosition }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fondo animado mejorado */}
      <div className="absolute inset-0">
        {/* Grid animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
            `, 
            backgroundSize: '60px 60px', 
            animation: 'grid-float 25s linear infinite' 
          }}/>
        </div>
        
        {/* Orbes luminosos animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] rounded-full" style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)', 
            left: `${mousePosition.x * 0.03}px`, 
            top: `${mousePosition.y * 0.03}px`, 
            filter: 'blur(80px)', 
            transform: 'translate(-50%, -50%)', 
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
          }} />
          
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/30 via-violet-500/20 to-transparent animate-float-slow" style={{ filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-transparent animate-float-slow" style={{ filter: 'blur(120px)', animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/25 to-transparent animate-float-slow" style={{ filter: 'blur(90px)', animationDelay: '6s' }} />
        </div>
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
          <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '2.5s' }} />
          <div className="absolute bottom-[40%] left-[20%] w-1 h-1 bg-violet-400/60 rounded-full animate-pulse" style={{ animationDelay: '4s', animationDuration: '3.5s' }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] p-6 lg:grid lg:grid-cols-2 lg:gap-20 items-center justify-center">
        {/* Ilustración mejorada */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 animate-float">
          <div className="relative group">
            {/* Anillo exterior giratorio */}
            <div className="absolute -inset-8 rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: '60s' }} />
            <div className="absolute -inset-12 rounded-full border border-blue-500/10 animate-spin" style={{ animationDuration: '90s', animationDirection: 'reverse' }} />
            
            {/* Fondo luminoso */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-violet-500/20 to-blue-500/30 blur-3xl scale-150 group-hover:scale-175 transition-transform duration-700" />
            
            {/* SVG principal mejorado */}
            <svg className="relative w-[420px] h-[420px] drop-shadow-2xl" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lg-tech" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6"><animate attributeName="stop-color" values="#8B5CF6;#6366F1;#3B82F6;#8B5CF6" dur="8s" repeatCount="indefinite" /></stop>
                  <stop offset="50%" stopColor="#6366F1"><animate attributeName="stop-color" values="#6366F1;#3B82F6;#06B6D4;#6366F1" dur="8s" repeatCount="indefinite" /></stop>
                  <stop offset="100%" stopColor="#06B6D4"><animate attributeName="stop-color" values="#06B6D4;#8B5CF6;#6366F1;#06B6D4" dur="8s" repeatCount="indefinite" /></stop>
                </linearGradient>
                <linearGradient id="lg-cal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#0F172A" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#1E293B" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="lg-header" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Círculos de fondo con animación */}
              <circle cx="200" cy="200" r="195" stroke="url(#lg-tech)" strokeWidth="2" opacity="0.3" className="animate-spin" style={{ animationDuration: '120s' }} />
              <circle cx="200" cy="200" r="170" stroke="url(#lg-tech)" strokeWidth="1" opacity="0.2" className="animate-spin" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />
              
              {/* Calendario principal */}
              <rect x="75" y="95" width="250" height="220" rx="28" fill="url(#lg-cal)" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" filter="url(#glow)" />
              <rect x="75" y="95" width="250" height="70" rx="28" fill="url(#lg-header)" />
              
              {/* Grid del calendario */}
              <g opacity="0.4">
                <line x1="125" y1="165" x2="125" y2="295" stroke="#475569" strokeWidth="1" />
                <line x1="175" y1="165" x2="175" y2="295" stroke="#475569" strokeWidth="1" />
                <line x1="225" y1="165" x2="225" y2="295" stroke="#475569" strokeWidth="1" />
                <line x1="275" y1="165" x2="275" y2="295" stroke="#475569" strokeWidth="1" />
                <line x1="95" y1="190" x2="305" y2="190" stroke="#475569" strokeWidth="1" />
                <line x1="95" y1="220" x2="305" y2="220" stroke="#475569" strokeWidth="1" />
                <line x1="95" y1="250" x2="305" y2="250" stroke="#475569" strokeWidth="1" />
              </g>
              
              {/* Checkmark animado */}
              <g className="animate-pulse">
                <circle cx="200" cy="235" r="45" fill="#10B981" filter="url(#glow)" />
                <path d="M170 235 L190 255 L235 210" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              
              {/* Puntos de progreso */}
              <circle cx="150" cy="275" r="8" fill="#10B981" opacity="0.8" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <circle cx="200" cy="275" r="8" fill="#F59E0B" opacity="0.8" className="animate-pulse" style={{ animationDelay: '2s' }} />
              <circle cx="250" cy="275" r="8" fill="#6B7280" opacity="0.6" />
            </svg>
            
            {/* Elementos flotantes */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          
          <div className="mt-12 text-center max-w-md">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight">
              Sistema de Gestión
              <span className="block text-3xl mt-1">Inteligente</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg font-medium">
              Optimiza la organización del hogar con
              <span className="text-purple-300 font-semibold"> tecnología avanzada</span> y análisis en tiempo real.
            </p>
            
            {/* Indicadores de características */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Tiempo Real</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <span>Multi-usuario</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <span>Gamificado</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de login premium */}
        <div className="relative lg:justify-self-center w-full max-w-lg mx-auto">
          {/* Anillo exterior animado */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-violet-600/30 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-violet-500/40 rounded-3xl blur-xl opacity-40 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          
          {/* Contenedor principal con glassmorphism */}
          <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Barra superior animada */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500" style={{ 
              animation: 'gradient-shift 4s ease infinite', 
              backgroundSize: '300% 100%' 
            }} />
            
            {/* Efectos de luz internos */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative p-8 sm:p-12">
              {/* Header mejorado */}
              <div className="text-center mb-12">
                {/* Logo/Icono */}
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                  Horario<span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">Pro</span>
                </h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-purple-500" />
                  <p className="text-xs text-purple-300 uppercase tracking-[0.3em] font-semibold">Edición Premium</p>
                  <div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-purple-500" />
                </div>
                <p className="text-xl text-slate-200 font-medium">
                  Bienvenido al
                  <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-bold"> futuro</span>
                </p>
              </div>
              
              {/* Botón de login premium */}
              <button 
                onClick={onSignIn} 
                disabled={isSigningIn} 
                className="relative w-full group overflow-hidden transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Efectos de hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Botón principal */}
                <div className="relative h-16 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 group-hover:border-purple-400/50 text-white font-bold flex items-center justify-center gap-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {isSigningIn ? (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                      </div>
                      <span className="text-lg">Conectando...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-lg font-semibold">Iniciar sesión con Google</span>
                      <svg className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
              
              {/* Footer del panel */}
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 mb-4">Acceso seguro con autenticación Google</p>
                <div className="flex justify-center items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Conexión segura</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-600 rounded-full" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <span>GDPR Compatible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón de tema flotante mejorado */}
      <button
        onClick={toggleTheme}
        className="fixed top-8 right-8 z-50 group"
        aria-label="Cambiar tema"
      >
        <div className="relative">
          {/* Anillo exterior animado */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Contenedor principal */}
          <div className="relative w-14 h-14 bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
            {/* Efecto de brillo interno */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icono animado */}
            <div className="relative">
              {theme === 'dark' ? (
                <svg className="w-6 h-6 text-yellow-400 transform transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-indigo-400 transform transition-transform duration-300 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-slate-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg border border-slate-600/50 whitespace-nowrap">
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800/90 border-l border-t border-slate-600/50 rotate-45" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default LoginPage;