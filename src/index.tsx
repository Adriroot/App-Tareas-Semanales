// ---- COPIA DESDE AQUÍ ----
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: any; };
  props: any;
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="glass-card p-8 rounded-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gradient mb-2">Algo salió mal</h2>
              <p className="text-gray-400 mb-4">La aplicación encontró un error inesperado.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-futuristic px-6 py-3 rounded-xl"
              >
                Recargar Aplicación
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full animate-pulse-glow opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full animate-pulse-glow opacity-20"></div>
      
      <div className="relative z-10">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center h-full">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-gray-400 mb-8">Organizando tu hogar del futuro</p>

          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">{progress}%</p>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Root Component with Theme Detection
const Root: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const detectTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme as 'light' | 'dark';
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    const initialTheme = detectTheme();
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    if ('performance' in window && 'measure' in window.performance) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
      });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-transitioning', 'true');
    const timer = setTimeout(() => {
      root.removeAttribute('data-theme-transitioning');
    }, 0);
    return () => clearTimeout(timer);
  }, [theme]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ErrorBoundary>
  );
};

let root: ReactDOM.Root | null = null;

const initializeApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    document.body.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: system-ui, -apple-system, sans-serif;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Error de Inicialización</h1>
          <p style="opacity: 0.9;">No se pudo encontrar el elemento root para montar la aplicación.</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: white; color: #667eea; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
            Reintentar
          </button>
        </div>
      </div>
    `;
    throw new Error("Could not find root element to mount application");
  }

  if (!root) {
    root = ReactDOM.createRoot(rootElement);
  }

  const checkBrowserCompatibility = () => {
    const requiredFeatures = [
      'localStorage' in window,
      'fetch' in window,
      'Promise' in window,
      'IntersectionObserver' in window
    ];
    return requiredFeatures.every(feature => feature);
  };

  if (!checkBrowserCompatibility()) {
    console.warn('Browser may not support all features. Consider updating your browser.');
  }

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }

  root.render(<Root />);
};

initializeApp();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('Hot reloading module...');
    initializeApp();
  });
}
// ---- HASTA AQUÍ ----