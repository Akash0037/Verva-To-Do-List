
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Priority, FilterType } from '../types';

const TaskList: React.FC = () => {
  const { tasks, toggleTask, deleteTask, addTask, filter, setFilter } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'today') return task.dueDate === new Date().toISOString().split('T')[0];
    if (filter === 'upcoming') return !task.completed && task.dueDate > new Date().toISOString().split('T')[0];
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addTask(newTitle, newPriority, newDate);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  const priorityColors = {
    [Priority.HIGH]: 'bg-rose-100 text-rose-700',
    [Priority.MEDIUM]: 'bg-amber-100 text-amber-700',
    [Priority.LOW]: 'bg-emerald-100 text-emerald-700'
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'today', 'upcoming', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                : 'bg-white text-gray-500 border border-gray-200 hover:border-emerald-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Task Area */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add new task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full text-lg border-none focus:ring-0 placeholder-gray-300 font-medium"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
            <div className="flex gap-4">
              <select 
                value={newPriority} 
                onChange={e => setNewPriority(e.target.value as Priority)}
                className="text-sm bg-gray-50 border-none rounded-lg px-3 py-2 text-gray-600 cursor-pointer"
              >
                <option value={Priority.LOW}>Low Priority</option>
                <option value={Priority.MEDIUM}>Medium Priority</option>
                <option value={Priority.HIGH}>High Priority</option>
              </select>
              <input 
                type="date" 
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="text-sm bg-gray-50 border-none rounded-lg px-3 py-2 text-gray-600 cursor-pointer"
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-700">Save Task</button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="grid gap-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400">No tasks found. Time to relax or create one!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-4 bg-white rounded-2xl border transition-all hover:shadow-md hover:border-emerald-100 ${
                task.completed ? 'opacity-60 bg-gray-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  {task.completed && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <div className="flex-1">
                  <h3 className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
