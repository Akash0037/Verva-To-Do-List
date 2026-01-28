
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, User, Priority, FilterType } from '../types';

interface AppContextType {
  tasks: Task[];
  user: User | null;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  addTask: (title: string, priority: Priority, dueDate: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  logout: () => void;
  productivityScore: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; user: User | null; onLogout: () => void }> = ({ 
  children, 
  user, 
  onLogout 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Persistence
  useEffect(() => {
    const savedTasks = localStorage.getItem(`verva_tasks_${user?.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`verva_tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = useCallback((title: string, priority: Priority, dueDate: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const calculateScore = () => {
    if (tasks.length === 0) return 100;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <AppContext.Provider value={{
      tasks,
      user,
      filter,
      setFilter,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      logout: onLogout,
      productivityScore: calculateScore()
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
