import React, { useState, useEffect } from 'react';
import { GlucoseLog, ViewState } from './types';
import { StorageService } from './services/storage';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { AddLogView } from './components/AddLogView';
import { HistoryView } from './components/HistoryView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [logs, setLogs] = useState<GlucoseLog[]>([]);

  useEffect(() => {
    // Load data on mount
    const loadedLogs = StorageService.seedData(); // Will seed if empty, else load
    setLogs(loadedLogs);
  }, []);

  const handleAddLog = (log: GlucoseLog) => {
    const newLogs = StorageService.addLog(log);
    setLogs(newLogs);
    setCurrentView('dashboard');
  };

  const handleDeleteLog = (id: string) => {
    const newLogs = StorageService.deleteLog(id);
    setLogs(newLogs);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView logs={logs} />;
      case 'add':
        return <AddLogView onSave={handleAddLog} onCancel={() => setCurrentView('dashboard')} />;
      case 'history':
        return <HistoryView logs={logs} onDelete={handleDeleteLog} />;
      default:
        return <DashboardView logs={logs} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="mx-auto max-w-md bg-slate-50 dark:bg-slate-950 min-h-screen shadow-2xl overflow-hidden relative transition-colors duration-300">
        {renderView()}
      </main>
      
      {/* Hide Bottom Nav on 'Add' screen to give more space/focus */}
      {currentView !== 'add' && (
        <BottomNav currentView={currentView} onChange={setCurrentView} />
      )}
    </div>
  );
};

export default App;