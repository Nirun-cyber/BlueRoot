import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: any;
  color: string;
  trend?: string;
  isWarning?: boolean;
  thresholdLabel?: string;
}

// Animates a number from 0 → target on mount
function useCountUp(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

const SensorCard: React.FC<SensorCardProps> = ({ title, value, unit, icon: Icon, color, trend, isWarning, thresholdLabel }) => {
  const { t } = useTranslation();
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
  const animated = useCountUp(numericValue, 900);
  const displayValue = typeof value === 'number'
    ? animated.toFixed(value % 1 !== 0 ? 1 : 0)
    : value;

  const trendPositive = trend?.startsWith('+');

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        glass card-glow rounded-[28px] p-6 relative overflow-hidden
        border ${isWarning
          ? 'border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.18)]'
          : 'border-[#4caf50]/30 shadow-[0_0_20px_rgba(76,175,80,0.12)]'}
        transition-all duration-300
      `}
    >
      {/* Subtle corner glow */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30 ${isWarning ? 'bg-red-400' : color.split(' ')[1]}`} />

      <div className="flex justify-between items-start mb-5 relative">
        <div className={`p-2.5 rounded-2xl ${color} shadow-sm`}>
          <Icon size={18} />
        </div>

        {trend && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
              trendPositive
                ? 'bg-green-500/10 text-[#4caf50] border-green-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {trend}
          </motion.span>
        )}
      </div>

      <div className="relative">
        <p className="text-slate-400 dark:text-white/35 text-[10px] font-black uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={Math.round(numericValue * 10)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[34px] font-black text-slate-800 dark:text-white leading-none tabular-nums"
          >
            {displayValue}
          </motion.span>
          <span className="text-slate-400 dark:text-white/35 text-xs font-bold">{unit}</span>
        </div>
        
        {thresholdLabel && (
          <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-white/25 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10" />
            {thresholdLabel}
          </p>
        )}
      </div>

      {isWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-red" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
            {t('dashboard.thresholdExceeded')}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SensorCard;

