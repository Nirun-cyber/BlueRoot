import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useSensors } from '../context/SensorContext';

const NotificationToast: React.FC = () => {
  const { t } = useTranslation();
  const { alerts, pushNotifications } = useSensors();
  const [currentToast, setCurrentToast] = useState<{ id: string; message: string; type: string } | null>(null);
  const [processedAlerts, setProcessedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (alerts.length > 0 && pushNotifications) {
      const latest = alerts[0];
      if (!processedAlerts.has(latest.id)) {
        setCurrentToast({ id: latest.id, message: latest.message, type: latest.type });
        setProcessedAlerts(prev => new Set(prev).add(latest.id));
        
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setCurrentToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [alerts, processedAlerts]);

  const iconMap: any = {
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    success: <CheckCircle2 className="text-[#4caf50]" size={20} />,
  };

  const bgMap: any = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500/20',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-500/20',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/20',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500/20',
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-none w-full max-w-sm">
      <AnimatePresence>
        {currentToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-2xl ${bgMap[currentToast.type] || bgMap.info}`}
          >
            <div className="shrink-0 p-2 rounded-xl bg-white dark:bg-black/20 shadow-sm">
              {iconMap[currentToast.type] || <Bell size={20} />}
            </div>
            <div className="flex-1 min-w-0 py-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 mb-1">
                {currentToast.type === 'error' ? t('dashboard.criticalAlert') : t('dashboard.systemNotification')}
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                {currentToast.message}
              </p>
            </div>
            <button 
              onClick={() => setCurrentToast(null)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-400"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;

