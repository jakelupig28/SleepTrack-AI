import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../services/authContext.jsx';
import { useToast } from '../services/toastContext.jsx';
import { Mail, Lock, Loader2, Moon } from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        showToast("Please enter both email and password.", "error");
        return;
    }
    
    setIsLoading(true);
    try {
        if (isRegistering) {
            await register(email, password);
            showToast("Account created successfully!", "success");
        } else {
            await login(email, password);
            showToast("Successfully logged in!", "success");
        }
    } catch (error) {
        console.error("Auth failed", error);
        showToast(error.message || "Authentication failed. Please try again.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#0A0E21] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-900/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 m-4"
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl transition-colors duration-300" />
        
        <div className="relative z-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Moon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">SleepTrack AI</h2>
            <p className="text-slate-500 dark:text-gray-400 mb-8 text-center text-sm">
                {isRegistering ? 'Start your journey to better rest.' : 'Welcome back to your dashboard.'}
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500 font-semibold ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/30 transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500 font-semibold ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/30 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center mt-6 transition-all"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        isRegistering ? 'Create Account' : 'Sign In'
                    )}
                </motion.button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                    {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;