import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Activity, Menu, Play, Square } from 'lucide-react';
import { ThemeToggle } from './Common';
import LanguageSelector from './LanguageSelector';
import { useSidebar } from '../context/SidebarContext';
import { useSensors } from '../context/SensorContext';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { isDemoMode, toggleDemoMode } = useSensors();
  const { t } = useTranslation();

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
        

    </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full border border-green-200 dark:border-green-500/20">
          <Activity size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t('navbar.liveFeed')}</span>
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

          <button 
            onClick={toggleDemoMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-lg ${
              isDemoMode 
                ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                : 'bg-gradient-to-r from-[#0073e6] to-[#005bb5] text-white shadow-blue-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            {isDemoMode ? <Square size={12} fill="white" /> : <Play size={12} fill="white" />}
            {isDemoMode ? 'Stop Demo' : 'Start Demo'}
          </button>
          
          <LanguageSelector />
          <ThemeToggle />

          <div className="flex items-center gap-3 pl-4 border-l border-black/5 dark:border-white/10 transition-colors">
            <div className="min-w-9 w-fit px-2 h-9 rounded-xl bg-agri-green flex items-center justify-center text-white font-bold text-[10px] shadow-md">
              {t('navbar.admin')}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};


export default Navbar;
