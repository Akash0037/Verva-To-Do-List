
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  activeTab: 'tasks' | 'ai' | 'analytics';
  onTabChange: (tab: 'tasks' | 'ai' | 'analytics') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'tasks', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    )},
    { id: 'ai', label: 'Verva AI Assistant', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )},
    { id: 'analytics', label: 'Analytics', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
    )},
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-white">
      <div className="flex items-center gap-3 mb-10 group cursor-default">
        <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <span className="font-black text-2xl text-emerald-950 tracking-tighter block leading-none">Verva</span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5 block">Architect</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={activeTab === item.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}>
              {item.icon}
            </span>
            <span className="text-[14px]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-50 pt-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50/80 backdrop-blur rounded-2xl mb-4 border border-slate-100">
          <div className="relative">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`} 
              alt={user?.name} 
              className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-black text-slate-900 truncate tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-medium text-slate-400 truncate tracking-wide">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold text-[13px] uppercase tracking-wider"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          System Exit
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
