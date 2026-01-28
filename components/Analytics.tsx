
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Analytics: React.FC = () => {
  const { tasks, productivityScore } = useAppContext();

  // Mock weekly data based on real tasks for demo
  const data = [
    { name: 'Mon', completed: Math.min(tasks.length, 3) },
    { name: 'Tue', completed: 5 },
    { name: 'Wed', completed: 2 },
    { name: 'Thu', completed: 8 },
    { name: 'Fri', completed: 4 },
    { name: 'Sat', completed: 6 },
    { name: 'Sun', completed: productivityScore / 10 },
  ];

  const pieData = [
    { name: 'Completed', value: tasks.filter(t => t.completed).length, color: '#059669' },
    { name: 'Remaining', value: tasks.filter(t => !t.completed).length, color: '#e5e7eb' },
  ];

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Stats</h1>
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
          <p className="text-gray-400">Complete some tasks to see your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Progress</h1>
        <p className="text-gray-500 mt-1">Keep it up! You're doing better than 75% of users.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-gray-400 text-sm font-medium">Productivity Score</p>
          <p className="text-4xl font-extrabold text-emerald-600 mt-2">{productivityScore}%</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-1000" style={{ width: `${productivityScore}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-gray-400 text-sm font-medium">Tasks Completed</p>
          <p className="text-4xl font-extrabold text-sky-600 mt-2">{tasks.filter(t => t.completed).length}</p>
          <p className="text-xs text-gray-500 mt-2">Total of {tasks.length} tasks</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-gray-400 text-sm font-medium">Active Streak</p>
          <p className="text-4xl font-extrabold text-amber-500 mt-2">4 Days</p>
          <p className="text-xs text-gray-500 mt-2">Personal best: 12 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Completion Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#059669' : '#a7f3d0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Task Breakdown</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded-full"></span>
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
                <span className="text-xs text-gray-500">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
