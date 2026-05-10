import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Activity, Menu } from 'lucide-react';
import { ThemeToggle } from './Common';
import { useSidebar } from '../context/SidebarContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <header className="h-20 bg-white dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:flex flex-1 max-w-xl">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-agri-green/50 transition-colors w-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Query platform intelligence..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-white placeholder-slate-400 font-medium"
          />
        </div>
      </div>
    </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full border border-green-200 dark:border-green-500/20">
          <Activity size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Live Feed Active</span>
        </div>

        <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10 hidden md:block transition-colors"></div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/alerts')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-green-700 dark:hover:text-white transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
          </button>
          
          <ThemeToggle />

          <div className="flex items-center gap-3 pl-4 border-l border-black/5 dark:border-white/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-agri-green flex items-center justify-center text-white font-bold text-sm shadow-md">
              OA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


export default Navbar;
