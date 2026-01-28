
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TaskList from '../components/TaskList';
import AiAssistant from '../components/AiAssistant';
import Pomodoro from '../components/Pomodoro';
import Analytics from '../components/Analytics';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const { user, logout } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'ai' | 'analytics'>('tasks');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 bg-white border-r border-gray-200 shadow-sm">
        <Sidebar onLogout={logout} user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 rounded-lg">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl text-gray-800">Verva</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <Sidebar onLogout={logout} user={user} activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={`lg:col-span-7 space-y-8 ${activeTab === 'ai' ? 'hidden lg:block' : ''}`}>
              {activeTab === 'analytics' ? (
                <Analytics />
              ) : (
                <div className="space-y-6">
                  <header>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome to Verva, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500 mt-1">Let's turn your goals into action today.</p>
                  </header>
                  <Pomodoro />
                  <TaskList />
                </div>
              )}
            </div>

            <div className={`lg:col-span-5 h-[calc(100vh-120px)] lg:sticky lg:top-8 ${activeTab !== 'ai' ? 'hidden lg:block' : ''}`}>
              <AiAssistant />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        <nav className="lg:hidden flex bg-white border-t border-gray-200 p-2 fixed bottom-0 w-full justify-around items-center z-10 shadow-lg">
          <button onClick={() => setActiveTab('tasks')} className={`p-2 flex flex-col items-center ${activeTab === 'tasks' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <span className="text-[10px] mt-1 font-medium">Tasks</span>
          </button>
          <button onClick={() => setActiveTab('ai')} className={`p-2 flex flex-col items-center ${activeTab === 'ai' ? 'text-sky-600' : 'text-gray-400'}`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="text-[10px] mt-1 font-medium">Verva AI</span>
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`p-2 flex flex-col items-center ${activeTab === 'analytics' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="text-[10px] mt-1 font-medium">Stats</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Dashboard;
