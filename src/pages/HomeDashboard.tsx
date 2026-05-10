import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplet, 
  FlaskConical, 
  Waves, 
  AlertTriangle,
  TrendingUp,
  Wifi
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import SensorCard from '../components/SensorCard';
import MotorStatusCard from '../components/MotorStatusCard';
import { useSensors } from '../context/SensorContext';

const mockChartData = [
  { time: '08:00', moisture: 42, ph: 6.8, tds: 750 },
  { time: '09:00', moisture: 40, ph: 6.7, tds: 760 },
  { time: '10:00', moisture: 38, ph: 6.9, tds: 740 },
  { time: '11:00', moisture: 35, ph: 6.8, tds: 755 },
  { time: '12:00', moisture: 32, ph: 6.7, tds: 770 },
  { time: '13:00', moisture: 45, ph: 6.8, tds: 765 },
  { time: '14:00', moisture: 48, ph: 6.9, tds: 750 },
];

// Stagger container variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

// Hero particles config
const PARTICLES = [
  { size: 80,  top: '10%',  left: '75%', delay: 0   },
  { size: 50,  top: '60%',  left: '85%', delay: 1   },
  { size: 120, top: '30%',  left: '90%', delay: 2   },
  { size: 40,  top: '75%',  left: '70%', delay: 0.5 },
  { size: 30,  top: '20%',  left: '60%', delay: 1.5 },
];

const HomeDashboard: React.FC = () => {
  const { data, alerts, logs, toggleIrrigation, toggleFertigation, toggleAutoMode, thresholds, isAutoMode } = useSensors();

  const systemStatus = useMemo(() => {
    if (alerts.some(a => a.type === 'error')) return { label: 'Critical', color: 'text-red-500 bg-red-50 border-red-200' };
    if (alerts.some(a => a.type === 'warning')) return { label: 'Warning', color: 'text-amber-500 bg-amber-50 border-amber-200' };
    return { label: 'All Systems Normal', color: 'text-[#4caf50] bg-green-50 border-green-200' };
  }, [alerts]);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">

      {/* ═══ HERO BANNER ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full bg-gradient-to-br from-[#0073e6] via-[#005bb5] to-[#4caf50] rounded-[24px] md:rounded-[32px] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-blue-500/20"
      >
        {/* Animated particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
            animate={{ y: [0, -16, 0], scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 text-white">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">

            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-green-300 rounded-full live-ping" />
                <div className="w-2 h-2 bg-green-300 rounded-full" />
              </div>
              LIVE
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold">
              <Wifi size={11} /> IoT Connected
            </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl md:text-4xl font-black leading-tight mb-3"
          >
            Soil moisture is low & salinity is rising.<br className="hidden md:block" />
            <span className="text-green-200">Irrigation recommended within 2 hours.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-white/75 font-medium text-sm max-w-xl"
          >
            Moisture index at <strong className="text-white">{data.soilMoisture.toFixed(1)}%</strong> (Critical). 
            Environmental factors are accelerating transpiration. TDS at <strong className="text-white">{data.tds.toFixed(0)} ppm</strong>.
          </motion.p>

          {/* Mini stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-6"
          >
            {[
              { label: 'Moisture', value: `${data.soilMoisture.toFixed(1)}%`, icon: Droplet },
              { label: 'pH',       value: data.ph.toFixed(1),                icon: FlaskConical },
              { label: 'TDS',      value: `${data.tds.toFixed(0)} ppm`,       icon: Waves },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                <stat.icon size={14} className="text-green-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{stat.label}</span>
                <span className="text-sm font-black text-white">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ SENSOR METRIC CARDS ══════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: 'Soil Moisture', value: data.soilMoisture, unit: '%',     icon: Droplet,       color: 'text-blue-500 bg-blue-50',   trend: '-2.4%',  isWarning: data.soilMoisture < thresholds.soilMoisture },
          { title: 'pH Level',      value: data.ph,           unit: 'pH',    icon: FlaskConical,  color: 'text-purple-500 bg-purple-50', trend: '+0.1',  isWarning: data.ph < thresholds.phMin || data.ph > thresholds.phMax },
          { title: 'Salinity (TDS)',value: data.tds,           unit: 'ppm',   icon: Waves,         color: 'text-amber-500 bg-amber-50', trend: '+12',    isWarning: data.tds > thresholds.tdsMax },
          { title: 'Recent Alerts', value: alerts.length,     unit: 'events',icon: AlertTriangle, color: 'text-red-500 bg-red-50',    trend: undefined, isWarning: alerts.some(a => a.type === 'error') },
        ].map(card => (
          <motion.div key={card.title} variants={itemVariants}>
            <SensorCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ CHARTS + CONTROLS ════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass card-glow rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Moisture & Quality Trends</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Last 24 Hours Analysis</p>
            </div>
            <div className="flex gap-4">
              {[{ color: 'bg-[#0073e6]', label: 'Moisture' }, { color: 'bg-[#4caf50]', label: 'pH' }].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-white/40">
                  <div className={`w-2 h-2 rounded-full ${l.color}`} />{l.label}
                </span>
              ))}
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#0073e6] bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                <TrendingUp size={10} /> Live
              </span>
            </div>
          </div>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0073e6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0073e6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4caf50" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(0,0,0,0.15)" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="rgba(0,0,0,0.15)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(30,154,78,0.2)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    color: '#1e293b',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: '#475569' }}
                  cursor={{ stroke: 'rgba(30,154,78,0.2)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="moisture" stroke="#0073e6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMoisture)" dot={false} />
                <Area type="monotone" dataKey="ph" stroke="#4caf50" strokeWidth={2} fillOpacity={1} fill="url(#colorPh)" dot={false} yAxisId={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Motor Control Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          <MotorStatusCard 
            type="irrigation"
            isOn={data.irrigationMotor}
            onToggle={toggleIrrigation}
            disabled={isAutoMode}
            isAutoMode={isAutoMode}
            onToggleAutoMode={toggleAutoMode}
          />
          <MotorStatusCard 
            type="fertigation"
            isOn={data.fertigationMotor}
            onToggle={toggleFertigation}
          />
        </motion.div>
      </motion.div>

      {/* ═══ SYSTEM STATUS + TDS MINI-CHART ═══════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* System Status Card */}
        <motion.div variants={itemVariants} className="glass card-glow rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-4">System Status</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border mb-4 ${systemStatus.color}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {systemStatus.label}
          </div>
          <div className="space-y-3">
            {[
              { label: 'pH Safety',    ok: data.ph >= thresholds.phMin && data.ph <= thresholds.phMax },
              { label: 'TDS Level',    ok: data.tds <= thresholds.tdsMax },
              { label: 'Irrigation',   ok: !alerts.some(a => a.type === 'error') },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-white/60">{item.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.ok ? 'bg-green-50 text-[#4caf50]' : 'bg-red-50 text-red-500'}`}>
                  {item.ok ? '✓ OK' : '✗ Alert'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TDS Trend Mini Chart */}
        <motion.div variants={itemVariants} className="glass card-glow rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-1">TDS Trend</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mb-4">{data.tds.toFixed(0)} <span className="text-sm font-bold text-slate-400">ppm</span></p>
          <div className="h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Line type="monotone" dataKey="tds" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Tooltip
                  contentStyle={{ display: 'none' }}
                  itemStyle={{ display: 'none' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Log Ticker */}
        <motion.div variants={itemVariants} className="glass card-glow rounded-3xl p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-red-400 rounded-full live-ping" />
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Live System Log</p>
          </div>
          <div className="space-y-2 overflow-hidden max-h-[100px]">
            {logs.length > 0 ? logs.slice(0, 4).map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/60"
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.type === 'irrigation' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                <span className="font-bold text-slate-500 dark:text-white/40 shrink-0">{log.timestamp}</span>
                <span className="truncate">{log.type.toUpperCase()} → {log.action}</span>
              </motion.div>
            )) : (
              <p className="text-xs text-slate-400 dark:text-white/30 italic">Monitoring active. No recent activity.</p>
            )}
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default HomeDashboard;
