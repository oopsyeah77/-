
import React, { useEffect, useState } from 'react';
import { Home, Briefcase, MessageSquare, User, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title: string;
  currentUser?: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, title, currentUser }) => {
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    // Simple check for WeChat user agent
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('micromessenger')) {
      setIsWeChat(true);
    }
  }, []);

  const navItems = [
    { id: 'dashboard', icon: Home, label: '指挥中心' },
    { id: 'projects', icon: Briefcase, label: '项目管理' },
    { id: 'feedback', icon: MessageSquare, label: '客户反馈' },
    { id: 'profile', icon: User, label: '我的档案' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR (Visible on md+) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-30 shrink-0">
         <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-900/50">
               <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <div>
               <h1 className="font-bold text-lg leading-tight tracking-wide">NEPDI-S</h1>
               <p className="text-[10px] text-slate-400 uppercase tracking-wider">Project Tracker</p>
            </div>
         </div>

         <nav className="flex-1 py-6 px-3 space-y-2">
            {navItems.map((item) => {
               const Icon = item.icon;
               const isActive = activeTab === item.id;
               return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                       isActive 
                         ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md' 
                         : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                     <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                     <span className="font-medium text-sm">{item.label}</span>
                     {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </button>
               );
            })}
         </nav>

         <div className="p-4 border-t border-slate-800">
            <div 
               onClick={() => onTabChange('profile')}
               className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-700"
            >
               <div className={`w-10 h-10 rounded-full ${currentUser?.avatarColor || 'bg-slate-600'} flex items-center justify-center text-sm font-bold border-2 border-slate-600`}>
                  {currentUser ? currentUser.initials : 'U'}
               </div>
               <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser?.title || 'Role'}</p>
               </div>
            </div>
         </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        
        {/* Mobile Header (Hidden on Desktop) */}
        {/* If in WeChat, we hide this header to avoid double title bars (Native + Web) */}
        {!isWeChat && (
          <header className="md:hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
            <div>
              <h1 className="text-lg font-bold tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-teal-400 rounded-full inline-block"></span>
                {title}
              </h1>
            </div>
            <div 
              onClick={() => onTabChange('profile')}
              className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600 text-teal-400 cursor-pointer hover:bg-slate-600 transition-colors"
            >
              {currentUser ? currentUser.initials : 'User'}
            </div>
          </header>
        )}

        {/* Content Scroller */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-slate-50 md:bg-slate-100">
           {/* Add top padding if header is hidden in WeChat to prevent content from touching status bar */}
           <div className={`md:p-8 p-4 min-h-full max-w-7xl mx-auto md:mx-0 w-full ${isWeChat ? 'pt-4' : ''}`}>
             {children}
           </div>
           {/* Mobile Bottom Padding */}
           <div className="h-20 md:hidden"></div>
        </main>

        {/* Mobile Bottom Navigation (Hidden on Desktop) */}
        <nav className="md:hidden bg-white/95 backdrop-blur-sm border-t border-slate-200 fixed bottom-0 w-full z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                    isActive ? 'text-teal-700 scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-sm" : ""} />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-teal-800' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
