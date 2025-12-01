import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyLog } from '../types';
import { useAuth } from './authContext';

interface DataContextType {
  logs: DailyLog[];
  addLog: (log: DailyLog) => Promise<void>;
  deleteLog: (date: string) => Promise<void>;
  refreshLogs: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const fetchLogs = async () => {
    if (!user) {
        setLogs([]);
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://localhost:5000/api/logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setLogs(data);
        }
    } catch (error) {
        console.error("Failed to fetch logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const addLog = async (log: DailyLog) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(log)
    });

    if (res.ok) {
        await fetchLogs(); // Refresh list from server
    } else {
        throw new Error("Failed to save log");
    }
  };

  const deleteLog = async (date: string) => {
    const token = localStorage.getItem('token');
    // Using date as ID for now based on current app structure
    const res = await fetch(`http://localhost:5000/api/logs/${date}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
        setLogs(prev => prev.filter(l => l.date !== date));
    }
  };

  return (
    <DataContext.Provider value={{ logs, addLog, deleteLog, refreshLogs: fetchLogs }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};