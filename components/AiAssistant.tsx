
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getAiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AiAssistant: React.FC = () => {
  const { tasks } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Hi there! I'm **Verva**, your productivity architect. \n\nI'm here to help you:\n• Design a **powerful daily plan**\n• Master your **busiest schedules**\n• Implement **elite focus habits**\n\nHow can we fuel your progress today?", 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Design my study plan",
    "Maximize my morning",
    "Strategy for 5 tasks",
    "Deep work focus tips"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: messageToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAiResponse(messageToSend, messages, tasks);
      const aiMsg: ChatMessage = { role: 'assistant', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-blue-900">$1</strong>')
        .replace(/^•\s+(.*)/g, '<li class="ml-4 list-disc text-slate-700">$1</li>')
        .replace(/^\d+\.\s+(.*)/g, '<li class="ml-4 list-decimal text-slate-700">$1</li>');
      
      return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }} className={line.startsWith('•') || line.match(/^\d+\./) ? 'mb-1' : 'mb-2'} />;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,58,138,0.1)] border border-slate-100 overflow-hidden relative">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-slate-900 font-black text-xl tracking-tight">Verva AI</h2>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Productivity Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live Sync</span>
           </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`flex items-start gap-3 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              )}
              <div className={`px-5 py-4 transition-all ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-3xl rounded-tr-lg shadow-blue-200 shadow-lg' 
                  : 'bg-white text-slate-800 rounded-3xl rounded-tl-lg border border-slate-200 shadow-sm'
              }`}>
                <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                  {formatContent(msg.content)}
                </div>
              </div>
            </div>
            <span className={`text-[9px] font-bold text-slate-400 mt-2 ${msg.role === 'user' ? 'mr-2' : 'ml-12'} uppercase tracking-widest`}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
               <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl rounded-tl-lg border border-slate-100 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-duration:0.8s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        {messages.length < 5 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-100 active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Instruct Verva..."
            className="w-full pl-6 pr-16 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-800 font-bold placeholder:text-slate-300 text-sm"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-md shadow-blue-100 active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
        <p className="text-center text-[9px] font-bold text-slate-300 mt-4 uppercase tracking-[0.3em] pointer-events-none">
          Verva Cognitive Core Enabled
        </p>
      </div>
    </div>
  );
};

export default AiAssistant;
