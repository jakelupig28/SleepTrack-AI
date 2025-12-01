import React from 'react';
import { LayoutDashboard, BookOpen, BarChart2, Settings, Moon, Sun, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../services/authContext.jsx';
import { useTheme } from '../services/themeContext.jsx';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children, activeTab, setActiveTab, onLogClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E21] text-slate-900 dark:text-white flex transition-colors duration-300">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A0E21] h-screen fixed left-0 top-0 z-50 transition-colors duration-300">
        <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">SleepTrack</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-600/10 dark:text-blue-400 dark:border-blue-600/20' 
                        : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-white'}`} />
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-2">
            <button 
                onClick={() => logout()}
                className="flex items-center space-x-3 px-4 py-3 w-full text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0A0E21]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
            <h1 className="text-lg font-semibold capitalize md:hidden text-slate-800 dark:text-white">{activeTab}</h1>
            
            <div className="hidden md:flex items-center space-x-3">
                <div className="text-slate-500 dark:text-gray-400 text-sm">
                    Welcome back, <span className="text-slate-900 dark:text-white font-medium">{user?.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogClick}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-blue-900/20 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Log Tonight</span>
                    <span className="sm:hidden">Log</span>
                </motion.button>
                
                <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[1px] cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0A0E21]"
                    aria-label="Edit Profile"
                >
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#0A0E21] flex items-center justify-center overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-slate-700 dark:text-white">{user?.displayName?.[0]}</span>
                        )}
                    </div>
                </button>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                {children}
            </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#0A0E21]/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 z-50 px-6 py-2 flex justify-between items-center safe-area-bottom transition-colors duration-300">
        {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center p-2 space-y-1"
            >
                <div className={`p-1.5 rounded-lg transition-colors ${
                    activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400' 
                    : 'text-slate-400 dark:text-gray-500'
                }`}>
                    <item.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-medium ${
                     activeTab === item.id 
                     ? 'text-blue-600 dark:text-blue-400' 
                     : 'text-slate-400 dark:text-gray-500'
                }`}>
                    {item.label}
                </span>
            </button>
        ))}
        {/* Mobile Theme Toggle */}
        <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center p-2 space-y-1"
        >
            <div className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500">
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500">Theme</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;