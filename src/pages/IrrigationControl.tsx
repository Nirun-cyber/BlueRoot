import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Activity, 
  AlertCircle, 
  History,
  Zap,
  Play,
  Square,
  ShieldCheck
} from 'lucide-react';
import { useSensors } from '../context/SensorContext';
import { StatusBadge } from '../components/Common';
import MotorStatusCard from '../components/MotorStatusCard';

const IrrigationControl: React.FC = () => {
  const { data, logs, alerts, isAutoMode, toggleIrrigation, toggleAutoMode } = useSensors();

  const isPhSafe = data.ph >= 6.0 && data.ph <= 7.5;
  const isTdsSafe = data.tds <= 1200;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Droplets size={32} className="text-blue-500 shrink-0" />
            Irrigation Control
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">Manage water distribution</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex-1 md:flex-none flex items-center gap-2 glass px-3 md:px-4 py-2 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(0,115,230,0.1)]">
             <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">Mode:</span>
             <StatusBadge status={isAutoMode ? 'active' : 'idle'} label={isAutoMode ? 'Auto' : 'Manual'} />
          </div>
          <button 
            onClick={toggleAutoMode}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              isAutoMode 
                ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100' 
                : 'bg-[#0073e6] text-white shadow-lg shadow-blue-500/20 hover:bg-[#005bb5]'
            }`}
          >
            {isAutoMode ? 'Manual' : 'Auto Mode'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Visualizer & Soil Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pump Animation Panel */}
          <div className="glass rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-blue-500/40 shadow-[0_0_20px_rgba(0,115,230,0.15)] relative overflow-hidden h-[300px] md:h-[400px] flex flex-col items-center justify-center">
            {/* Background water wave animation */}
            <AnimatePresence>
              {data.irrigationMotor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-0 w-full h-24 bg-blue-500/5 rounded-full"
                      animate={{ y: [0, -20, 0], scaleX: [1, 1.1, 1] }}
                      transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                      style={{ bottom: `${i * 20}px` }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main pump icon */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={data.irrigationMotor ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-32 h-32 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  data.irrigationMotor 
                    ? 'bg-blue-500 text-white shadow-[0_0_40px_rgba(59,130,246,0.5)]' 
                    : 'bg-slate-100 dark:bg-white/10 text-slate-300 dark:text-white/20'
                }`}
              >
                <Zap size={64} fill={data.irrigationMotor ? 'currentColor' : 'none'} />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Main Pump Station</h3>
              <StatusBadge 
                status={data.irrigationMotor ? 'active' : 'idle'} 
                label={data.irrigationMotor ? 'Irrigation Active' : 'System Ready'} 
              />
            </div>

            {/* Flow Stats */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Flow Rate</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {data.irrigationMotor ? '12.5 L/min' : '0.0 L/min'}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Pressure</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {data.irrigationMotor ? '3.2 bar' : '0.0 bar'}
                </p>
              </div>
            </div>
          </div>

          {/* Soil & Safety cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-6 border border-blue-500/40 shadow-[0_0_20px_rgba(0,115,230,0.15)]">
              <div className="flex items-center gap-3 mb-4 text-blue-500">
                <Activity size={20} />
                <h4 className="font-bold text-slate-800 dark:text-white">Soil Condition</h4>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-slate-800 dark:text-white">{data.soilMoisture.toFixed(1)}%</span>
                <span className="text-sm text-slate-400 dark:text-white/40">Moisture Content</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${data.soilMoisture}%` }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-white/40 mt-2 font-medium">
                Threshold: {30}% | {data.soilMoisture < 30 ? '⚠ Below threshold' : '✓ Within range'}
              </p>
            </div>

            <div className="glass rounded-3xl p-6 border border-green-500/40 shadow-[0_0_20px_rgba(76,175,80,0.15)]">
              <div className={`flex items-center gap-3 mb-4 ${isPhSafe && isTdsSafe ? 'text-[#4caf50]' : 'text-red-500'}`}>
                {isPhSafe && isTdsSafe ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                <h4 className="font-bold text-slate-800 dark:text-white">Safety Status</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-white/60 mb-4 leading-relaxed">
                {alerts.some(a => a.type === 'error') 
                  ? 'Critical safety overrides active. Manual override required.' 
                  : 'All safety parameters within nominal ranges. Auto-system engaged.'}
              </p>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={isPhSafe ? 'healthy' : 'error'} label={`pH: ${data.ph.toFixed(1)}`} />
                <StatusBadge status={isTdsSafe ? 'healthy' : 'error'} label={`TDS: ${data.tds.toFixed(0)}ppm`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & History */}
        <div className="space-y-6">
          <MotorStatusCard 
            type="irrigation"
            isOn={data.irrigationMotor}
            onToggle={toggleIrrigation}
            disabled={isAutoMode}
            isAutoMode={isAutoMode}
            onToggleAutoMode={toggleAutoMode}
          />

          {/* Activity Log */}
          <div className="glass rounded-3xl p-6 border border-blue-500/40 shadow-[0_0_20px_rgba(0,115,230,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                Recent Activity
              </h4>
              <button className="text-[10px] font-bold text-[#0073e6] uppercase hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {logs.filter(l => l.type === 'irrigation').slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${log.action === 'START' ? 'bg-blue-500/10 text-[#0073e6]' : 'bg-red-50 text-red-500'}`}>
                      {log.action === 'START' ? <Play size={12} /> : <Square size={12} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tighter text-slate-700 dark:text-white">Pump {log.action}</p>
                      <p className="text-[10px] text-slate-400 dark:text-white/40">{log.timestamp}</p>
                    </div>
                  </div>
                  <StatusBadge status={log.action === 'START' ? 'active' : 'idle'} label={log.action === 'START' ? 'ON' : 'OFF'} />
                </div>
              ))}
              {logs.filter(l => l.type === 'irrigation').length === 0 && (
                <p className="text-center py-4 text-xs text-slate-400 dark:text-white/40">No activity logged yet.</p>
              )}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="glass rounded-3xl p-6 border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5">
            <h4 className="text-red-500 font-bold mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              Critical Alerts
            </h4>
            <div className="space-y-2">
              {alerts.filter(a => a.type === 'error').slice(0, 2).map(alert => (
                <div key={alert.id} className="text-[10px] text-red-500 font-medium p-2 rounded-lg border border-red-100 dark:border-red-500/10 bg-white dark:bg-transparent">
                  [{alert.timestamp}] {alert.message}
                </div>
              ))}
              {alerts.filter(a => a.type === 'error').length === 0 && (
                <p className="text-[10px] text-red-400 dark:text-red-500/40">No critical alerts detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationControl;
