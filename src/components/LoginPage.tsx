// Archivo: src/components/LoginPage.tsx - VERSIÓN ESPECTACULAR ✨

import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onSignIn: () => void;
  isSigningIn: boolean;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
  mousePosition: { x: number; y: number };
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignIn, isSigningIn, toggleTheme, theme }) => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    setMounted(true);
    // Crear partículas flotantes
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Animated */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
      
      {/* Animated Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/10 rounded-3xl rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-16 h-16 border-2 border-cyan-400/30 rounded-full animate-pulse" />

      {/* Glass Morphism Container */}
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className={`w-full max-w-lg transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* Logo con glow effect */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 transform hover:scale-110 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
                <svg className="w-16 h-16 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              {/* Rings of power */}
              <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-white/20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-2 w-28 h-28 mx-auto border-2 border-cyan-300/30 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
            </div>

            {/* Title with gradient text */}
            <div className="relative">
              <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
                Horario
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-2xl rounded-full" />
            </div>
            
            {/* Animated underline */}
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mx-auto mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/50 animate-pulse" />
            </div>
            
            <p className="text-xl text-white/80 font-medium leading-relaxed max-w-md mx-auto">
              ✨ <span className="text-cyan-300">Transforma</span> las tareas del hogar en una 
              <span className="text-purple-300"> experiencia colaborativa</span> ✨
            </p>
          </div>
          
          {/* Login Card with Glass Morphism */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">¡Empezemos!</h2>
                <p className="text-white/70 text-sm">Inicia sesión para unirte a tu hogar</p>
              </div>

              <button 
                onClick={onSignIn} 
                disabled={isSigningIn} 
                className="w-full h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                {isSigningIn ? (
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-lg">Conectando magia...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 relative z-10">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-lg font-semibold">Continuar con Google</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                )}
              </button>
              
              <div className="flex items-center gap-2 justify-center mt-6 text-white/60 text-sm">
                <div className="w-6 h-px bg-gradient-to-r from-transparent to-white/30" />
                <span>🔒 100% Seguro y Privado</span>
                <div className="w-6 h-px bg-gradient-to-l from-transparent to-white/30" />
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-white/80 text-xs font-medium">Logros</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-white/80 text-xs font-medium">Estadísticas</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-white/80 text-xs font-medium">Colaboración</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme Toggle - Now Floating and Gorgeous */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 w-14 h-14 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
        aria-label="Cambiar tema"
      >
        <div className="relative">
          {theme === 'dark' ? (
            <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse" />
        </div>
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 6s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;