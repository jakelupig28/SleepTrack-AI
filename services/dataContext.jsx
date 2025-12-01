import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext.jsx';

const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

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

  const addLog = async (log) => {
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

  const deleteLog = async (date) => {
    const token = localStorage.getItem('token');
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