import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Cpu, 
  Lock, 
  RefreshCw,
  Save,
  Moon,
  Sun,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SearchBar, StatusBadge } from '../components/Common';
import { useTheme } from '../context/ThemeContext';
import { useSensors } from '../context/SensorContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { thresholds, updateThresholds, isAutoMode, toggleAutoMode } = useSensors();
  const [localThresholds, setLocalThresholds] = useState(thresholds);

  const handleSave = () => {
    updateThresholds(localThresholds);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setLocalThresholds(thresholds);
  };

  const settingSections = [
    { id: 'profile', icon: User, title: 'User Profile', desc: 'Manage your account and preferences' },
    { id: 'system', icon: Cpu, title: 'System Configuration', desc: 'Hardware and connection settings' },
    { id: 'notifications', icon: Bell, title: 'Notifications', desc: 'Control alert levels and methods' },
    { id: 'security', icon: Lock, title: 'Security', desc: 'Access control and safety locks' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <SettingsIcon size={32} className="text-agri-green" />
            Settings
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">Configure your smart farm system</p>
        </div>
        <StatusBadge status="healthy" label="System V1.0.4" />
      </div>

      <SearchBar placeholder="Search settings..." className="max-w-md" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {settingSections.map((section) => (
          <button 
            key={section.id}
            className="glass p-4 rounded-2xl border border-[#1e9a4e]/30 shadow-[0_0_15px_rgba(30,154,78,0.08)] text-left hover:border-[#1e9a4e]/60 transition-all group"
          >
            <section.icon className="text-slate-400 dark:text-white/40 group-hover:text-[#1e9a4e] mb-2 transition-colors" size={20} />
            <h4 className="font-bold text-sm text-slate-700 dark:text-white">{section.title}</h4>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="glass rounded-3xl p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
            <ShieldCheck size={20} className="text-[#1e9a4e]" />
            Appearance & UI
          </h3>
          <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-slate-400 dark:text-white/40">Toggle between dark and light themes</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="w-14 h-8 bg-black/10 dark:bg-white/10 rounded-full relative p-1 transition-colors"
            >
              <motion.div 
                animate={{ x: theme === 'dark' ? 24 : 0 }}
                className="w-6 h-6 bg-agri-green rounded-full flex items-center justify-center text-white"
              >
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              </motion.div>
            </button>
          </div>
        </section>

        {/* Thresholds Section */}
        <section className="glass rounded-3xl p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
            <Zap size={20} className="text-[#1e9a4e]" />
            Sensor Thresholds
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Moisture ON Threshold (%)</label>
                <input 
                  type="number" 
                  value={localThresholds.moistureOn}
                  onChange={(e) => setLocalThresholds({...localThresholds, moistureOn: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1e9a4e] text-slate-800 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Moisture OFF Threshold (%)</label>
                <input 
                  type="number" 
                  value={localThresholds.moistureOff}
                  onChange={(e) => setLocalThresholds({...localThresholds, moistureOff: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1e9a4e] text-slate-800 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Max TDS (ppm)</label>
                <input 
                  type="number" 
                  value={localThresholds.tdsMax}
                  onChange={(e) => setLocalThresholds({...localThresholds, tdsMax: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1e9a4e] text-slate-800 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Min pH Level</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={localThresholds.phMin}
                  onChange={(e) => setLocalThresholds({...localThresholds, phMin: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1e9a4e] text-slate-800 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Max pH Level</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={localThresholds.phMax}
                  onChange={(e) => setLocalThresholds({...localThresholds, phMax: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1e9a4e] text-slate-800 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Auto-Irrigation Mode</p>
                <p className="text-sm text-slate-400 dark:text-white/40">Enable automatic control based on thresholds</p>
              </div>
              <button 
                onClick={toggleAutoMode}
                className={`w-14 h-8 rounded-full relative p-1 transition-colors ${isAutoMode ? 'bg-agri-green' : 'bg-black/10 dark:bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: isAutoMode ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <RefreshCw size={20} />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-agri-green text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
