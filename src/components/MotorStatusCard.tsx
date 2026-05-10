import React from 'react';
import { motion } from 'framer-motion';
import { Power, PowerOff, Droplet, FlaskConical } from 'lucide-react';

interface MotorStatusCardProps {
  type: 'irrigation' | 'fertigation';
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isAutoMode?: boolean;
  onToggleAutoMode?: () => void;
}

const MotorStatusCard: React.FC<MotorStatusCardProps> = ({ type, isOn, onToggle, disabled, isAutoMode, onToggleAutoMode }) => {
  const isIrrigation = type === 'irrigation';
  
  return (
    <div className={`glass rounded-3xl p-6 border border-blue-500/20 shadow-[0_0_20px_rgba(0,115,230,0.1)] transition-shadow`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOn ? (isIrrigation ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-[#4caf50]') : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40'}`}>
            {isIrrigation ? <Droplet size={24} /> : <FlaskConical size={24} />}
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-white font-bold capitalize">{type} Motor</h4>
            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-widest">System {type.charAt(0).toUpperCase()}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${isOn ? (isIrrigation ? 'bg-blue-500 animate-pulse' : 'bg-[#4caf50] animate-pulse') : 'bg-slate-200 dark:bg-white/10'}`}></div>
      </div>

      {/* Manual / Auto toggle — only for irrigation motor */}
      {isIrrigation && onToggleAutoMode && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 mb-4">
          <div>
            <span className="text-sm text-slate-600 dark:text-white/70 font-semibold">
              {isAutoMode ? 'Auto Mode' : 'Manual Mode'}
            </span>
            <p className="text-[10px] text-slate-400 dark:text-white/40 font-medium">
              {isAutoMode ? 'System controls irrigation' : 'You control irrigation'}
            </p>
          </div>
          <button
            onClick={onToggleAutoMode}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              isAutoMode ? 'bg-[#0073e6]' : 'bg-slate-300 dark:bg-white/20'
            }`}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
              style={{ left: isAutoMode ? '1.5rem' : '0.25rem' }}
            />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-sm text-slate-500 dark:text-white/60 font-medium">Status</span>
          <span className={`text-sm font-bold ${isOn ? 'text-[#4caf50]' : 'text-slate-400 dark:text-white/40'}`}>
            {isOn ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        <button
          onClick={onToggle}
          disabled={disabled || isAutoMode}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300 ${
            disabled || isAutoMode
              ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 cursor-not-allowed'
              : isOn 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-[#0073e6] text-white shadow-[0_0_20px_rgba(0,115,230,0.3)] hover:shadow-[0_0_30px_rgba(0,115,230,0.5)]'
          }`}
        >
          {isOn ? <PowerOff size={20} /> : <Power size={20} />}
          {isAutoMode && isIrrigation ? 'Auto-Managed' : isOn ? 'Stop Motor' : 'Start Motor'}
        </button>
      </div>
      
      {isOn && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider">Live Consumption</p>
          <div className="h-3 bg-slate-200/50 dark:bg-black/40 rounded-full overflow-hidden shadow-inner border border-slate-300/50 dark:border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className={`absolute left-0 top-0 bottom-0 rounded-full ${isIrrigation ? 'liquid-bar-blue' : 'liquid-bar-green'}`}
            ></motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotorStatusCard;

