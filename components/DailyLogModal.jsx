import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Coffee, Smartphone, Wine, Frown, Meh, Smile, Zap, ChevronRight, ChevronLeft, Save } from 'lucide-react';

const steps = [
  { id: 1, title: 'Sleep Data', icon: Moon },
  { id: 2, title: 'Habits', icon: Coffee },
  { id: 3, title: 'Morning Energy', icon: Zap },
];

const emojis = [
  { val: 1, icon: Frown, label: 'Exhausted', color: 'text-red-500 dark:text-red-400' },
  { val: 2, icon: Meh, label: 'Groachy', color: 'text-orange-500 dark:text-orange-400' },
  { val: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500 dark:text-yellow-400' },
  { val: 4, icon: Smile, label: 'Good', color: 'text-blue-500 dark:text-blue-400' },
  { val: 5, icon: Zap, label: 'Energized', color: 'text-green-500 dark:text-green-400' },
];

const DailyLogModal = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    duration: 7,
    quality: 75,
    caffeineLate: false,
    screenTimeLate: false,
    alcoholLate: false,
    energyRating: 3,
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleSave = () => {
    const log = {
      date: new Date().toISOString(),
      sleepMetrics: {
        durationHours: formData.duration,
        qualityScore: formData.quality
      },
      habits: {
        caffeineLate: formData.caffeineLate,
        screenTimeLate: formData.screenTimeLate,
        alcoholLate: formData.alcoholLate,
        stressLevel: 5 
      },
      energyRating: formData.energyRating
    };
    
    onSave(log);
    onClose();
    setTimeout(() => setCurrentStep(1), 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-[#0A0E21] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            Log Tonight
            <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Step {currentStep}/3
            </span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: '33%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-700 dark:text-gray-300 font-medium">Hours Slept</label>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formData.duration}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="12" 
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 dark:text-gray-500">
                    <span>2h</span>
                    <span>12h</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-700 dark:text-gray-300 font-medium">Sleep Quality Estimate</label>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formData.quality}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={formData.quality}
                    onChange={(e) => setFormData({...formData, quality: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 dark:text-gray-500">
                    <span>Poor</span>
                    <span>Perfect</span>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-slate-500 dark:text-gray-400 mb-4">Did you do any of these before bed?</p>
                
                {[
                  { key: 'screenTimeLate', label: 'Used Phone Late', icon: Smartphone, color: 'text-blue-500 dark:text-blue-400' },
                  { key: 'caffeineLate', label: 'Drank Caffeine', icon: Coffee, color: 'text-orange-500 dark:text-orange-400' },
                  { key: 'alcoholLate', label: 'Drank Alcohol', icon: Wine, color: 'text-red-500 dark:text-red-400' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFormData(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                      formData[item.key] 
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-600/20 dark:border-blue-500/50' 
                        : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-white dark:bg-black/20 ${item.color} shadow-sm dark:shadow-none`}>
                        <item.icon size={20} />
                      </div>
                      <span className={`font-medium ${formData[item.key] ? 'text-blue-900 dark:text-white' : 'text-slate-500 dark:text-gray-400'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      formData[item.key] ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-gray-600'
                    }`}>
                      {formData[item.key] && <motion.div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 gap-3"
              >
                 <p className="text-slate-500 dark:text-gray-400 mb-2 text-center">How's your energy this morning?</p>
                 <div className="grid grid-cols-5 gap-2">
                    {emojis.map((emoji) => (
                       <button
                          key={emoji.val}
                          onClick={() => setFormData({...formData, energyRating: emoji.val})}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            formData.energyRating === emoji.val
                            ? 'bg-slate-100 border-slate-300 dark:bg-white/10 dark:border-white/30 scale-105 shadow-sm'
                            : 'bg-slate-50 border-transparent dark:bg-slate-800/30 opacity-50 hover:opacity-100'
                          }`}
                       >
                          <emoji.icon className={`w-8 h-8 mb-2 ${emoji.color}`} />
                          <span className="text-[10px] text-slate-500 dark:text-gray-400">{emoji.label}</span>
                       </button>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 flex justify-between bg-slate-50 dark:bg-slate-900/50">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 1 ? 'text-slate-300 dark:text-gray-600 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          {currentStep === 3 ? (
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleSave}
               className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-green-900/20"
             >
               <Save size={16} className="mr-2" />
               Save Log
             </motion.button>
          ) : (
            <button 
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-blue-900/20 transition-all"
            >
              <span>Next</span>
              <ChevronRight size={16} className="ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyLogModal;