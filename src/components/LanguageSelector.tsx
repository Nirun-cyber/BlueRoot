import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-agri-green/30 dark:hover:border-agri-green/30 transition-all group"
      >
        <Languages size={18} className="text-slate-500 dark:text-white/60 group-hover:text-agri-green transition-colors" />
        <span className="text-sm font-bold text-slate-700 dark:text-white/80 hidden sm:block">
          {currentLanguage.native}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#0f1712] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 z-[100] overflow-hidden"
          >
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-agri-green/10 text-agri-green'
                      : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{lang.native}</span>
                    <span className="text-[10px] opacity-60 uppercase tracking-tighter">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && <Check size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
