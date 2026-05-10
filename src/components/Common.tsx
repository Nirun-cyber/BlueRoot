import React from 'react';
import { Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'error' | 'active' | 'idle';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const colors = {
    healthy: 'bg-agri-green/10 text-agri-green border-agri-green/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    active: 'bg-agri-blue/10 text-agri-blue border-agri-blue/20',
    idle: 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 border-black/10 dark:border-white/10',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[status]}`}>
      {label || status}
    </span>
  );
};

export const SearchBar: React.FC<{ placeholder?: string; className?: string }> = ({ placeholder = "Search...", className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 group-focus-within:text-agri-green transition-colors" size={18} />
      <input 
        type="text" 
        placeholder={placeholder}
        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:border-agri-green/50 focus:ring-1 focus:ring-agri-green/30 transition-all text-sm text-black dark:text-white"
      />
    </div>
  );
};
