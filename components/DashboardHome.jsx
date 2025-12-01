import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { useTheme } from '../services/themeContext.jsx';
import { useData } from '../services/dataContext.jsx';

const weeklyData = [
  { name: 'Mon', score: 75 },
  { name: 'Tue', score: 82 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 88 },
  { name: 'Fri', score: 92 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 78 },
];

const DashboardHome = () => {
  const { theme } = useTheme();
  const { logs } = useData();

  const todayStr = new Date().toDateString();
  const todaysLog = logs.find(log => new Date(log.date).toDateString() === todayStr);
  const currentScore = todaysLog ? todaysLog.sleepMetrics.qualityScore : 0;
  const hasLogToday = !!todaysLog;

  const sleepScoreData = [
    { name: 'Score', value: currentScore },
    { name: 'Remaining', value: 100 - currentScore },
  ];

  const pieColors = theme === 'dark' 
    ? ['#8b5cf6', '#1e293b'] 
    : ['#6366f1', '#e2e8f0']; 
  
  const chartGridColor = theme === 'dark' ? '#ffffff08' : '#e2e8f0';
  const axisTextColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tooltipText = theme === 'dark' ? '#fff' : '#1e293b';

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Overview of your sleep health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative backdrop-blur-sm shadow-xl transition-colors duration-300"
        >
          <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium absolute top-6 left-6">Today's Score</h3>
          <div className="w-full h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sleepScoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {sleepScoreData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={!hasLogToday && index === 0 ? 'transparent' : pieColors[index % pieColors.length]} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {hasLogToday ? (
                  <>
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">{currentScore}</span>
                    <span className="text-xs text-indigo-500 dark:text-purple-400 font-medium">
                        {currentScore >= 80 ? 'Excellent' : currentScore >= 60 ? 'Fair' : 'Needs Work'}
                    </span>
                  </>
              ) : (
                  <>
                    <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">--</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">No Data</span>
                  </>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
            {hasLogToday ? 'Based on duration & quality' : 'Log your sleep to see score'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl md:col-span-2 transition-colors duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium">Weekly Trend</h3>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-xs bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+5% vs last week</span>
            </div>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke={axisTextColor} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  hide={true} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
                  itemStyle={{ color: '#8b5cf6' }}
                  cursor={{ stroke: theme === 'dark' ? '#ffffff20' : '#00000010', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke={theme === 'dark' ? "#a78bfa" : "#6366f1"}
                  strokeWidth={3} 
                  dot={{ r: 4, fill: theme === 'dark' ? '#8b5cf6' : '#4f46e5', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: theme === 'dark' ? '#fff' : '#1e293b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group transition-colors duration-300"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-24 h-24 text-yellow-400" />
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-slate-800 dark:text-white font-semibold">Quick Insight</h3>
          </div>
          
          <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            "Your deep sleep decreases by <span className="text-red-500 dark:text-red-400 font-bold">15%</span> on days you report high caffeine intake."
          </p>
          
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium flex items-center transition-colors">
            View correlation details &rarr;
          </button>
        </motion.div>

         <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {[
              { label: 'Avg. Duration', val: hasLogToday ? `${todaysLog?.sleepMetrics.durationHours}h` : '--', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Bedtime', val: '11:45 PM', color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Wake Up', val: '7:15 AM', color: 'text-orange-600 dark:text-orange-400' },
              { label: 'Efficiency', val: '92%', color: 'text-green-600 dark:text-green-400' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
              >
                <div className="text-slate-400 dark:text-gray-500 text-xs mb-1 uppercase tracking-wider">{stat.label}</div>
                <div className={`text-lg font-bold ${stat.color}`}>{stat.val}</div>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DashboardHome;