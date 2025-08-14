// Archivo: App.tsx - VERSIÓN FINAL Y COMPLETA CON TRANSACCIÓN

import React, { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import { db, auth, googleProvider } from './firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
// --- 1. IMPORTAMOS runTransaction ---
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc, query, where, getDocs, getDoc, orderBy, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Task, HistoryEntry, UserStats, TaskTemplate, Toast, Achievement, DayOfWeek, ArchivedWeek, UserProfile } from './types';
import { DAYS_OF_WEEK, ACHIEVEMENTS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';

// --- Componentes ---
import Header from './components/Header';
import UserSelector from './components/UserSelector';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import ProgressTracker from './components/ProgressTracker';
import Nav from './components/Nav';
import StatsNav from './components/StatsNav';
import AllTimeStats from './components/AllTimeStats';
import WeeklyArchive from './components/WeeklyArchive';
import ToastContainer from './components/Toast';
import FabMenu from './components/FabMenu';
import MonthlyStats from './components/MonthlyStats';

// --- Modales ---
import EditTaskModal from './components/EditTaskModal';
import TemplateManager from './components/TemplateManager';
import ConfirmationModal from './components/ConfirmationModal';
import SetDateModal from './components/SetDateModal';
import EditProfileModal from './components/EditProfileModal';

// --- Pantallas de Flujo ---
import LoginPage from './components/LoginPage';
import UserProfileSetup from './components/UserProfileSetup';

// --- Utilidades ---
import { triggerConfetti } from './utils/confetti';

// --- Contexto de Tema ---
type Theme = 'light' | 'dark';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- Tipos de Vista ---
type View = 'semana' | 'hoy' | 'stats';
type StatsView = 'weekly' | 'all-time' | 'archive' | 'monthly';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => { const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', handleMouseMove); return () => window.removeEventListener('mousemove', handleMouseMove); }, []);
  const toggleTheme = useCallback(() => setTheme(p => (p === 'light' ? 'dark' : 'light')), [setTheme]);

  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [householdUsers, setHouseholdUsers] = useState<UserProfile[]>([]);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  
  const [view, setView] = useLocalStorage<View>('chore-view', 'semana');
  const [statsView, setStatsView] = useLocalStorage<StatsView>('chore-stats-view', 'weekly');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [archivedWeeks, setArchivedWeeks] = useState<ArchivedWeek[]>([]);
  const [weekStartDate, setWeekStartDate] = useState<string>(new Date().toISOString());
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isSetDateModalOpen, setSetDateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => { const newToast: Toast = { id: Date.now().toString(), message, type }; setToasts(p => [...p, newToast]); }, []);
  useEffect(() => { 
    const unsub = onAuthStateChanged(auth, async u => { 
      if (u) { 
        setAuthUser(u); 
        const userDoc = await getDoc(doc(db, 'users', u.uid)); 
        if (userDoc.exists()) { 
          const p = userDoc.data() as UserProfile; 
          setUserProfile(p); 
          setShowOnboarding(!p.householdId); 
        } else { 
          setShowOnboarding(true); 
        } 
      } else { 
        setAuthUser(null); 
        setUserProfile(null); 
        setHouseholdUsers([]); 
        setShowOnboarding(false); 
      } 
    }); 
    return () => unsub(); 
  }, []);
  useEffect(() => { if (!userProfile?.householdId) return; const { householdId } = userProfile; const listeners = [onSnapshot(query(collection(db, 'tasks'), where('householdId', '==', householdId)), s => setTasks(s.docs.map(d => ({...d.data(), id: d.id} as Task)).sort((a,b) => DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day)))), onSnapshot(query(collection(db, 'history'), where('householdId', '==', householdId), orderBy('date', 'asc')), s => setHistory(s.docs.map(d => ({...d.data(), id: d.id} as HistoryEntry)))), onSnapshot(query(collection(db, 'templates'), where('householdId', '==', householdId)), s => setTemplates(s.docs.map(d => ({...d.data(), id: d.id} as TaskTemplate)))), onSnapshot(query(collection(db, 'archivedWeeks'), where('householdId', '==', householdId), orderBy('startDate', 'desc')), s => setArchivedWeeks(s.docs.map(d => ({...d.data(), id: d.id} as ArchivedWeek)))), onSnapshot(doc(db, 'householdState', householdId), d => { if (d.exists()) { const data = d.data(); setWeekStartDate(data.weekStartDate); setUnlockedAchievements(data.unlockedAchievements || []); } else { setDoc(doc(db, 'householdState', householdId), { weekStartDate: new Date().toISOString(), unlockedAchievements: [] }); } }), onSnapshot(query(collection(db, 'users'), where('householdId', '==', householdId)), s => setHouseholdUsers(s.docs.map(d => d.data() as UserProfile)))]; return () => listeners.forEach(unsub => unsub()); }, [userProfile]);
  const signInWithGoogle = async () => { 
    setIsSigningIn(true); 
    try { 
      // Volver a popup para mejor UX (los warnings CORS no son críticos)
      await signInWithPopup(auth, googleProvider);
    } catch (e) { 
      console.error(e); 
      showToast('Error al iniciar sesión.', 'error'); 
    } finally {
      setIsSigningIn(false);
    }
  };
  const handleProfileSaved = (p: UserProfile) => { setUserProfile(p); setShowOnboarding(false); };
  const weeklyHistory = useMemo(() => history.filter(h => typeof h.date === 'string' && new Date(h.date) >= new Date(weekStartDate)), [history, weekStartDate]);
  const weeklyStats = useMemo(() => { const s: Record<string, UserStats> = {}; householdUsers.forEach(u => { s[u.uid] = { points: 0, completedTasks: 0 }; }); weeklyHistory.forEach(h => { if (!s[h.userId]) s[h.userId] = { points: 0, completedTasks: 0 }; s[h.userId].points += h.points; s[h.userId].completedTasks += 1; }); return s; }, [weeklyHistory, householdUsers]);
  const dismissToast = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);
  useEffect(() => { if (toasts.length > 0) { const timer = setTimeout(() => dismissToast(toasts[0].id), 4000); return () => clearTimeout(timer); } }, [toasts, dismissToast]);
  const checkAchievements = useCallback(async () => { if (!userProfile?.householdId) return; const newAch = ACHIEVEMENTS.filter(a => !unlockedAchievements.includes(a.id) && a.check(weeklyStats, history, tasks, householdUsers, userProfile)).map(a => a.id); if (newAch.length > 0) { const newUnlocked = [...new Set([...unlockedAchievements, ...newAch])]; await updateDoc(doc(db, 'householdState', userProfile.householdId), { unlockedAchievements: newUnlocked }); newAch.forEach(id => { const a = ACHIEVEMENTS.find(x => x.id === id); if (a) { showToast(`¡Logro: ${a.name}!`, 'achievement'); triggerConfetti(); } }); } }, [unlockedAchievements, weeklyStats, history, tasks, householdUsers, userProfile, showToast]);
  useEffect(() => { if (userProfile) checkAchievements(); }, [weeklyStats, checkAchievements, userProfile]);
  const handleStartNewWeek = () => { if (!userProfile?.householdId) return; setConfirmationModal({ isOpen: true, title: 'Nueva Semana', message: '¿Archivar semana actual y reiniciar?', onConfirm: async () => { const { householdId } = userProfile; if (weeklyHistory.length > 0) { const start = new Date(weekStartDate); const end = new Date(start); end.setDate(start.getDate() + 6); await addDoc(collection(db, 'archivedWeeks'), { householdId, startDate: weekStartDate, endDate: end.toISOString(), completedTasks: weeklyHistory, stats: weeklyStats }); } const batch = writeBatch(db); tasks.filter(t => t.isCompleted).forEach(t => batch.update(doc(db, 'tasks', t.id), { isCompleted: false, completedBy: null })); await batch.commit(); await updateDoc(doc(db, 'householdState', householdId), { weekStartDate: new Date().toISOString() }); showToast('¡Nueva semana iniciada!', 'success'); setConfirmationModal(p => ({ ...p, isOpen: false })); }}); };
  const handleSetWeekDate = async (d: string) => { if (!userProfile?.householdId) return; await updateDoc(doc(db, 'householdState', userProfile.householdId), { weekStartDate: new Date(d).toISOString() }); showToast('Fecha actualizada.', 'success'); setSetDateModalOpen(false); };
  const handleAddTask = async (t: Omit<Task, 'id'|'isCompleted'|'householdId'|'completedBy'>) => { if (!userProfile) return; await addDoc(collection(db, 'tasks'), { ...t, isCompleted: false, completedBy: null, householdId: userProfile.householdId }); showToast(`Tarea "${t.name}" añadida.`, 'success'); };
  const handleUpdateTask = async (t: Task) => { const { id, ...data } = t; await updateDoc(doc(db, 'tasks', id), data); setEditingTask(null); showToast('Tarea actualizada.', 'success'); };

  // --- 2. FUNCIÓN handleCompleteTask REEMPLAZADA POR LA VERSIÓN CON TRANSACCIÓN ---
  const handleCompleteTask = async (taskId: string, points: number) => {
    if (!userProfile) return;
    
    const taskRef = doc(db, 'tasks', taskId);
    
    try {
      await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskRef);

        if (!taskDoc.exists() || taskDoc.data().isCompleted) {
          throw new Error("La tarea ya fue completada o no existe.");
        }

        const taskData = taskDoc.data() as Task;

        transaction.update(taskRef, {
          isCompleted: true,
          completedBy: { uid: userProfile.uid, displayName: userProfile.displayName }
        });

        const newHistoryRef = doc(collection(db, 'history'));
        transaction.set(newHistoryRef, {
          taskId: taskId,
          taskName: taskData.name,
          userId: userProfile.uid,
          userDisplayName: userProfile.displayName,
          date: serverTimestamp(), // Usamos la hora del servidor
          points: points,
          householdId: userProfile.householdId
        });
      });

      const completedTask = tasks.find(t => t.id === taskId);
      showToast(`¡"${completedTask?.name}" completada! +${points} pts`, 'success');

    } catch (error: any) {
      console.error("Error en la transacción de completar tarea: ", error.message);
      if (error.message.includes("ya fue completada")) {
        showToast('¡Ups! Parece que alguien se te adelantó.', 'info');
      } else {
        showToast('No se pudo completar la tarea.', 'error');
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    
    const msg = taskToDelete.isCompleted ? 
      "Eliminarla revertirá los puntos y la quitará del historial. ¿Continuar?" : 
      "¿Seguro que quieres eliminarla?";
    
    setConfirmationModal({
      isOpen: true,
      title: 'Eliminar Tarea',
      message: msg,
      onConfirm: async () => {
        try {
          const batch = writeBatch(db);
          batch.delete(doc(db, 'tasks', id));
          
          if (taskToDelete.isCompleted) {
            // Usar el historial en memoria en lugar de hacer query
            const historyToDelete = history.filter(h => h.taskId === id);
            historyToDelete.forEach(h => batch.delete(doc(db, 'history', h.id)));
          }
          
          await batch.commit();
          showToast('Tarea eliminada.', 'info');
        } catch (e) {
          console.error(e);
          showToast('Error al eliminar.', 'error');
        } finally {
          setConfirmationModal(p => ({ ...p, isOpen: false }));
        }
      }
    });
  };
  const handleDeleteTemplate = (id: string) => setConfirmationModal({ isOpen: true, title: 'Eliminar Plantilla', message: '¿Seguro?', onConfirm: async () => { await deleteDoc(doc(db, 'templates', id)); showToast('Plantilla eliminada.', 'info'); setConfirmationModal(p => ({ ...p, isOpen: false })); } });
  const handleSaveTemplate = async (name: string, scope: 'day' | 'week', day?: DayOfWeek) => { if (!userProfile?.householdId) return; const tasksToSave = scope === 'week' ? tasks : tasks.filter(t => t.day === day); if (tasksToSave.length === 0) return showToast('No hay tareas para guardar.', 'info'); await addDoc(collection(db, 'templates'), { name, scope, day, tasks: tasksToSave.map(({ id, isCompleted, completedBy, householdId, ...rest }) => rest), householdId: userProfile.householdId }); showToast(`Plantilla "${name}" guardada.`, 'success'); };
  const handleLoadTemplate = (id: string) => { if (!userProfile?.householdId) return; const tpl = templates.find(t => t.id === id); if (!tpl) return; setConfirmationModal({ isOpen: true, title: `Cargar Plantilla "${tpl.name}"`, message: '¿Reemplazar tareas existentes?', onConfirm: async () => { const { householdId } = userProfile; const q = query(collection(db, 'tasks'), where('householdId', '==', householdId), ...(tpl.scope === 'day' && tpl.day ? [where('day', '==', tpl.day)] : [])); const snap = await getDocs(q); const batch = writeBatch(db); snap.forEach(d => batch.delete(d.ref)); tpl.tasks.forEach(t => batch.set(doc(collection(db, 'tasks')), { ...t, isCompleted: false, completedBy: null, householdId })); await batch.commit(); showToast(`Plantilla "${tpl.name}" cargada.`, 'success'); setConfirmationModal(p => ({ ...p, isOpen: false })); }}); };
  const getTasksForView = () => { if (view === 'hoy') { const jsDayIndex = new Date().getDay(); const ourDayIndex = (jsDayIndex + 6) % 7; const today = DAYS_OF_WEEK[ourDayIndex]; return tasks.filter(t => t.day === today); } return tasks; };
  
  if (!authUser) return <LoginPage onSignIn={signInWithGoogle} isSigningIn={isSigningIn} toggleTheme={toggleTheme} theme={theme} mousePosition={mousePosition} />;
  if (showOnboarding) return <UserProfileSetup authUser={authUser} onProfileSaved={handleProfileSaved} />;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen p-4 pb-24">
        <ToastContainer toasts={toasts} onDismiss={dismissToast}/>
        <div className="max-w-4xl mx-auto">
          <Header />
          <div className="mb-6"><UserSelector users={householdUsers} currentUser={userProfile} /></div>
          <Nav currentView={view} setView={setView} />
          <main className="mt-8">
            {view === 'stats' ? (
              <div className="space-y-6">
                <StatsNav currentView={statsView} setView={setStatsView} />
                {statsView === 'weekly' && <ProgressTracker stats={weeklyStats} history={history} users={householdUsers} tasks={tasks} unlockedAchievements={unlockedAchievements} />}
                {statsView === 'all-time' && <AllTimeStats history={history} users={householdUsers} />}
                {statsView === 'monthly' && <MonthlyStats history={history} users={householdUsers} />}
                {statsView === 'archive' && <WeeklyArchive archivedWeeks={archivedWeeks} users={householdUsers}/>}
              </div>
            ) : (
              <>
                <AddTaskForm onAddTask={handleAddTask} users={householdUsers} />
                <div className="p-4 sm:p-6 bg-[var(--card)] rounded-2xl shadow-lg">
                  <TaskList title={view === 'semana' ? 'Horario Semanal' : `Tareas para Hoy`} tasks={getTasksForView()} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onEdit={setEditingTask} currentUser={userProfile} users={householdUsers} />
                </div>
              </>
            )}
          </main>
          
          <FabMenu onInvite={() => userProfile && showToast(`Código: ${userProfile.householdId}`, 'info')} onSettings={() => setProfileModalOpen(true)} onTemplates={() => setTemplateModalOpen(true)} onEditDate={() => setSetDateModalOpen(true)} onResetWeek={handleStartNewWeek} />
        </div>
        
        {editingTask && <EditTaskModal isOpen={!!editingTask} task={editingTask} onUpdate={handleUpdateTask} onClose={() => setEditingTask(null)} users={householdUsers} />}
        {isTemplateModalOpen && <TemplateManager tasks={tasks} templates={templates} onSave={handleSaveTemplate} onLoad={handleLoadTemplate} onDelete={handleDeleteTemplate} onClose={() => setTemplateModalOpen(false)} />}
        {isSetDateModalOpen && <SetDateModal currentDate={weekStartDate} onSave={handleSetWeekDate} onClose={() => setSetDateModalOpen(false)} />}
        <ConfirmationModal isOpen={confirmationModal.isOpen} title={confirmationModal.title} message={confirmationModal.message} onConfirm={confirmationModal.onConfirm} onClose={() => setConfirmationModal(p => ({...p, isOpen: false}))} />
        {userProfile && <EditProfileModal isOpen={isProfileModalOpen} currentUser={userProfile} onClose={() => setProfileModalOpen(false)} onProfileUpdated={(p) => { setUserProfile(p); setProfileModalOpen(false); }} />}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;