import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  FlaskConical, 
  Waves, 
  ShieldCheck, 
  AlertTriangle,
  Droplet,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useSensors } from '../context/SensorContext';
import { StatusBadge } from '../components/Common';

const mockTrendData = [
  { time: '00:00', ph: 6.8, tds: 740 },
  { time: '04:00', ph: 6.9, tds: 755 },
  { time: '08:00', ph: 6.7, tds: 760 },
  { time: '12:00', ph: 7.2, tds: 790 },
  { time: '16:00', ph: 7.1, tds: 775 },
  { time: '20:00', ph: 6.9, tds: 750 },
];

const WaterQuality: React.FC = () => {
  const { data, thresholds } = useSensors();

  const isPhSafe = data.ph >= thresholds.phMin && data.ph <= thresholds.phMax;
  const isTdsSafe = data.tds <= thresholds.tdsMax;
  const isQualitySafe = isPhSafe && isTdsSafe;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Activity size={32} className="text-agri-green shrink-0" />
            Water Quality
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">Real-time pH and TDS analysis</p>
        </div>
        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border ${isQualitySafe ? 'bg-agri-green/10 border-agri-green/20 text-agri-green' : 'bg-red-500/10 border-red-500/20 text-red-500'} transition-all duration-500`}>
           {isQualitySafe ? <ShieldCheck size={24} /> : <AlertTriangle size={24} className="animate-bounce" />}
           <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">System Status</p>
              <h4 className="font-bold text-lg leading-tight">{isQualitySafe ? 'Water Quality Safe' : 'Safety Lock Engaged'}</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* pH Monitoring Card */}
        <div className="glass rounded-[2rem] p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] space-y-8 relative overflow-hidden transition-shadow">
          <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between relative">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                   <FlaskConical size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">Acidity (pH)</h3>
                   <StatusBadge status={isPhSafe ? 'healthy' : 'error'} />
                </div>
             </div>
             <p className="text-sm font-bold text-slate-400 dark:text-white/40">Safe Range: {thresholds.phMin}-{thresholds.phMax}</p>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
             <div className="text-5xl md:text-6xl font-black mb-2 text-purple-500">{data.ph.toFixed(1)}</div>
             <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Live pH Value</p>
          </div>

          <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full relative overflow-hidden">
             {/* pH Scale Gradient */}
             <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-purple-500 opacity-20"></div>
             {/* Indicator */}
             <motion.div 
               animate={{ left: `${(data.ph / 14) * 100}%` }}
               className="absolute top-0 w-2 h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"
             />
          </div>
          
          <div className="flex justify-between text-[10px] font-black text-slate-300 dark:text-white/20 uppercase">
             <span>Acidic</span>
             <span>Neutral</span>
             <span>Alkaline</span>
          </div>
        </div>

        {/* TDS Monitoring Card */}
        <div className="glass rounded-[2rem] p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] space-y-8 relative overflow-hidden transition-shadow">
          <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-agri-blue/5 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between relative">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-agri-blue/10 text-agri-blue flex items-center justify-center">
                   <Waves size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">Salinity (TDS)</h3>
                   <StatusBadge status={isTdsSafe ? 'healthy' : 'error'} />
                </div>
             </div>
             <p className="text-sm font-bold text-slate-400 dark:text-white/40">Threshold: &lt;{thresholds.tdsMax}ppm</p>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
             <div className="text-5xl md:text-6xl font-black mb-2 text-agri-blue">{data.tds}</div>
             <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Parts Per Million</p>
          </div>

          <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full relative overflow-hidden">
             <motion.div 
               animate={{ width: `${Math.min(100, (data.tds / 1500) * 100)}%` }}
               className={`h-full ${isTdsSafe ? 'bg-agri-blue' : 'bg-red-500'}`}
             />
          </div>

          <div className="flex justify-between text-[10px] font-black text-slate-300 dark:text-white/20 uppercase">
             <span>Fresh</span>
             <span>Brackish</span>
             <span>Saline</span>
          </div>
        </div>
      </div>

      {/* Historical Analytics */}
      <div className="glass rounded-[2rem] p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] transition-shadow">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-bold text-slate-800 dark:text-white">Water Parameter Trends</h3>
               <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mt-1">Detailed Analysis Over 24h</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-white/60">pH Levels</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-agri-blue"></div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-white/60">Salinity (ppm)</span>
               </div>
            </div>
         </div>
         
         <div className="w-full h-[300px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                  <XAxis dataKey="time" stroke="#00000020" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#00000020" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#00000020" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px', 
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} />
                  <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass rounded-2xl p-6 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] transition-shadow">
            <div className="flex items-center gap-3 mb-3 text-agri-green">
               <ShieldCheck size={20} />
               <h4 className="font-bold text-slate-800 dark:text-white">Safe Irrigation</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed">
               Irrigation is currently <span className={isQualitySafe ? 'text-agri-green font-bold' : 'text-red-500 font-bold'}>{isQualitySafe ? 'ALLOWED' : 'DISABLED'}</span> based on real-time water quality metrics.
            </p>
         </div>
         <div className="glass rounded-2xl p-6 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] transition-shadow">
            <div className="flex items-center gap-3 mb-3 text-agri-blue">
               <Droplet size={20} />
               <h4 className="font-bold text-slate-800 dark:text-white">Water Source</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed">
               Connected to <span className="font-bold text-slate-700 dark:text-white">North Well Station 2</span>. Last maintenance: April 12th, 2026.
            </p>
         </div>
         <div className="glass rounded-2xl p-6 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] transition-shadow">
            <div className="flex items-center gap-3 mb-3 text-purple-500">
               <Info size={20} />
               <h4 className="font-bold text-slate-800 dark:text-white">Quality Standard</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed">
               Current quality meets <span className="font-bold text-slate-700 dark:text-white">ISO-9001 Agri-Standard</span> for open-field organic cultivation.
            </p>
         </div>
      </div>
    </div>
  );
};

export default WaterQuality;
