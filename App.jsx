import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/authContext.jsx';
import { ThemeProvider } from './services/themeContext.jsx';
import { DataProvider, useData } from './services/dataContext.jsx';
import { ToastProvider } from './services/toastContext.jsx';
import Login from './components/Login.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardHome from './components/DashboardHome.jsx';
import DailyLogModal from './components/DailyLogModal.jsx';
import JournalView from './components/JournalView.jsx';
import SettingsView from './components/SettingsView.jsx';
import { Coffee } from 'lucide-react';

const PlaceholderView = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 dark:text-gray-500">
        <Coffee className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-slate-300 dark:text-gray-400 mb-2">{title}</h2>
        <p>This section is under development.</p>
    </div>
);

function MainContent() {
    const { user, loading } = useAuth();
    const { addLog } = useData();
    const [activeTab, setActiveTab] = useState('home');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    const handleSaveLog = (log) => {
        addLog(log);
        // Also simulate switching to journal to see the entry
        // setActiveTab('journal'); 
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-[#0A0E21] flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <>
            <DashboardLayout 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                onLogClick={() => setIsLogModalOpen(true)}
            >
                {activeTab === 'home' && <DashboardHome />}
                {activeTab === 'journal' && <JournalView />}
                {activeTab === 'insights' && <PlaceholderView title="Detailed Insights" />}
                {activeTab === 'settings' && <SettingsView />}
            </DashboardLayout>

            <DailyLogModal 
                isOpen={isLogModalOpen} 
                onClose={() => setIsLogModalOpen(false)} 
                onSave={handleSaveLog} 
            />
        </>
    );
}

function App() {
  return (
    <ThemeProvider>
        <ToastProvider>
            <AuthProvider>
                <DataProvider>
                    <div className="font-sans selection:bg-blue-500/30">
                        <MainContent />
                    </div>
                </DataProvider>
            </AuthProvider>
        </ToastProvider>
    </ThemeProvider>
  );
}

export default App;