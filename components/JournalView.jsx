import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../services/dataContext.jsx';
import { Calendar, Clock, Activity, Coffee, Smartphone, Wine, Zap, Trash2 } from 'lucide-react';
import { useToast } from '../services/toastContext.jsx';

const JournalView = () => {
  const { logs, deleteLog } = useData();
  const { showToast } = useToast();

  const handleDelete = async (date) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
        try {
            await deleteLog(date);
            showToast("Log deleted", "info");
        } catch (e) {
            showToast("Failed to delete log", "error");
        }
    }
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
        <Calendar className="w-16 h-16 mb-4 opacity-20" />
        <p>No logs yet. Start tracking tonight!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sleep Journal</h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm">A history of your rest.</p>
      </div>

      <div className="grid gap-4">
        {logs.map((log, index) => (
          <motion.div
            key={log.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group"
          >
            <button 
                onClick={() => handleDelete(log.date)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Entry"
            >
                <Trash2 size={18} />
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner
                  ${log.sleepMetrics.qualityScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
                    log.sleepMetrics.qualityScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 
                    'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}
                >
                  {log.sleepMetrics.qualityScore}
                </div>
                <div>
                  <div className="flex items-center text-slate-900 dark:text-white font-medium">
                    <Calendar className="w-3 h-3 mr-2 text-slate-400" />
                    {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {log.sleepMetrics.durationHours} hrs slept
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {log.habits.caffeineLate && (
                  <div title="Caffeine" className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    <Coffee size={16} />
                  </div>
                )}
                {log.habits.screenTimeLate && (
                   <div title="Screen Time" className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Smartphone size={16} />
                  </div>
                )}
                 {log.habits.alcoholLate && (
                   <div title="Alcohol" className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <Wine size={16} />
                  </div>
                )}
                {!log.habits.caffeineLate && !log.habits.screenTimeLate && !log.habits.alcoholLate && (
                    <span className="text-xs text-slate-400 dark:text-gray-600 italic">No bad habits</span>
                )}
              </div>

              <div className="md:w-1/3 flex flex-col items-start md:items-end pr-8">
                 <div className="flex items-center text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                    Energy: {log.energyRating}/5
                 </div>
                 {log.userNotes && (
                     <p className="text-xs text-slate-500 dark:text-gray-500 italic truncate max-w-[200px]">
                         "{log.userNotes}"
                     </p>
                 )}
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JournalView;