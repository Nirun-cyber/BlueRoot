import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { 
  Calendar, 
  Clock, 
  Plus, 
  FlaskConical, 
  Zap,
  Trash2,
  ChevronUp,
  ChevronDown,
  Timer,
  X
} from 'lucide-react';
import { useSensors } from '../context/SensorContext';
import { StatusBadge } from '../components/Common';
import MotorStatusCard from '../components/MotorStatusCard';

interface Schedule {
  id: number;
  name: string;
  time: string;   // "HH:MM" 24-hr format
  duration: number; // minutes
  status: 'pending' | 'running' | 'completed';
  timeLeft?: number; // seconds remaining when running
}

// ------ Custom Time Picker Component ------
const CustomTimePicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const [h, m] = value ? value.split(':') : ['00', '00'];

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSelect = (newH: string, newM: string) => {
    onChange(`${newH}:${newM}`);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-[#4caf50] transition-colors"
      >
        <Clock size={18} className="text-[#4caf50]" />
        <span className="text-sm font-mono font-bold text-slate-800 dark:text-white">
          {h}:{m}
        </span>
        <div className="ml-auto flex flex-col items-center justify-center opacity-40 text-slate-400">
          <ChevronUp size={12} />
          <ChevronDown size={12} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[70] p-4 flex gap-4 h-[240px]"
            >
              {/* Hours Column */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-2 text-center">{t('fertigation.hours') || 'Hours'}</p>
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 pr-1">
                  {hours.map(hour => (
                    <button
                      key={hour}
                      onClick={() => handleSelect(hour, m)}
                      className={`w-full py-2 rounded-lg text-sm font-mono transition-all ${
                        hour === h 
                          ? 'bg-[#4caf50] text-white shadow-lg shadow-green-500/20 scale-105' 
                          : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px bg-slate-100 dark:bg-white/5 my-4" />

              {/* Minutes Column */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-2 text-center">{t('fertigation.minutes') || 'Minutes'}</p>
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 pr-1">
                  {minutes.map(minute => (
                    <button
                      key={minute}
                      onClick={() => handleSelect(h, minute)}
                      className={`w-full py-2 rounded-lg text-sm font-mono transition-all ${
                        minute === m 
                          ? 'bg-[#4caf50] text-white shadow-lg shadow-green-500/20 scale-105' 
                          : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#4caf50] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
              >
                {t('fertigation.confirm')}
              </button>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const FertigationScheduler: React.FC = () => {
  const { t } = useTranslation();
  const { data, toggleFertigation } = useSensors();


  // ------ Active cycle countdown (tracks the running schedule) ------
  const [activeTimeLeft, setActiveTimeLeft] = useState(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // ------ New Schedule modal state ------
  const [showModal, setShowModal]   = useState(false);
  const [newName, setNewName]       = useState('');
  const [newTime, setNewTime]       = useState('');
  const [newDuration, setNewDuration] = useState('');

  // Ref to prevent double-firing toggleFertigation
  const motorFired = useRef(false);

  // ---- Tick: check scheduled start times every second ----
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hhmm = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setSchedules(prev => prev.map(s => {
        if (s.status === 'pending' && s.time === hhmm) {
          // Start this schedule
          if (!data.fertigationMotor && !motorFired.current) {
            motorFired.current = true;
            toggleFertigation();
          }
          return { ...s, status: 'running', timeLeft: s.duration * 60 };
        }
        if (s.status === 'running' && s.timeLeft !== undefined) {
          if (s.timeLeft <= 1) {
            // Done — stop motor
            if (data.fertigationMotor) toggleFertigation();
            motorFired.current = false;
            return { ...s, status: 'completed', timeLeft: 0 };
          }
          return { ...s, timeLeft: s.timeLeft - 1 };
        }
        return s;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [data.fertigationMotor, toggleFertigation]);

  // Sync activeTimeLeft to the running schedule
  useEffect(() => {
    const running = schedules.find(s => s.status === 'running');
    setActiveTimeLeft(running?.timeLeft ?? 0);
  }, [schedules]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalRunning = schedules.find(s => s.status === 'running');
  const totalSeconds = totalRunning ? totalRunning.duration * 60 : 120;

  // ------ Open modal pre-filled with current time ------
  const handleOpenModal = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    setNewTime(`${hh}:${mm}`);
    setNewName('');
    setNewDuration('');
    setShowModal(true);
  };

  // ------ Add new schedule ------
  const handleAddSchedule = () => {
    if (!newTime || !newDuration || Number(newDuration) <= 0) return;
    setSchedules(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newName || 'Custom Cycle',
        time: newTime,
        duration: Number(newDuration),
        status: 'pending',
      }
    ]);
    setShowModal(false);
    setNewName('');
    setNewTime('');
    setNewDuration('');
  };

  // ------ Delete schedule ------
  const handleDelete = (id: number) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto relative">

      {/* ============ NEW SCHEDULE MODAL ============ */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowModal(false)}
            />

            {/* Full-screen flex container to truly center the modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md mx-4 pointer-events-auto"
              >
                <div className="bg-white dark:bg-[#1a1a1a] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-green-200 dark:border-green-500/30 shadow-2xl shadow-green-500/10">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 text-[#4caf50] flex items-center justify-center">
                      <Timer size={20} />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white">{t('fertigation.newSchedule')}</h3>
                      <p className="text-[10px] md:text-xs text-slate-400 dark:text-white/40">{t('fertigation.setTimeDuration')}</p>
                    </div>

                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-5">
                  {/* Cycle Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                      {t('fertigation.cycleName')} <span className="text-slate-300">{t('fertigation.optional')}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t('fertigation.placeholderName')}
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-white/20 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <CustomTimePicker
                      value={newTime}
                      onChange={setNewTime}
                    />
                    <p className="text-[10px] text-slate-400 dark:text-white/30">
                      {t('fertigation.startTimeHint')}
                    </p>

                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                      {t('fertigation.duration')} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Zap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={120}
                        placeholder="e.g. 15"
                        value={newDuration}
                        onChange={e => setNewDuration(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-white/20 focus:outline-none focus:border-green-400 transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-white/30">
                      {t('fertigation.durationHint')}
                    </p>
                  </div>

                  {/* Info box */}
                  {newTime && newDuration && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20">
                      <FlaskConical size={16} className="text-[#4caf50] mt-0.5 shrink-0" />
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium leading-relaxed">
                        {t('fertigation.infoBox', { time: newTime, duration: newDuration })}
                      </p>
                    </div>

                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  >
                    {t('fertigation.cancel')}
                  </button>
                  <button
                    onClick={handleAddSchedule}
                    disabled={!newTime || !newDuration}
                    className="flex-1 py-3 rounded-xl bg-[#4caf50] text-white font-bold text-sm shadow-lg shadow-green-500/20 hover:bg-[#388e3c] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {t('fertigation.addSchedule')}
                  </button>

                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Calendar size={32} className="text-[#4caf50]" />
            {t('fertigation.title')}
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">{t('fertigation.subtitle')}</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-[#4caf50] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 hover:bg-[#388e3c] transition-all"
        >
          <Plus size={18} />
          {t('fertigation.newSchedule')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ============ LEFT ============ */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Cycle Panel */}
          <div className="glass rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 min-h-[300px]">
            {totalRunning ? (
              <>
                <div className="relative shrink-0">
                  <svg className="w-48 h-48 -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-white/5" />
                    <motion.circle
                      cx="96" cy="96" r="88"
                      stroke="#4caf50" strokeWidth="8" fill="none"
                      strokeDasharray={2 * Math.PI * 88}
                      animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - activeTimeLeft / totalSeconds) }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">{t('fertigation.remaining')}</p>
                    <p className="text-4xl font-bold font-mono text-slate-800 dark:text-white">{formatTime(activeTimeLeft)}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <StatusBadge
                      status="active"
                      label={t('fertigation.cycleInProgress')}
                    />
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
                      {totalRunning.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-white/60 mt-1">
                      {t('fertigation.runningHint', { duration: totalRunning.duration })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase mb-1">{t('fertigation.startTime')}</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-white">{totalRunning.time}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase mb-1">{t('fertigation.duration').split(' ')[0]}</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-white">{totalRunning.duration} min</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center scale-90 md:scale-100">
                  {/* High-end orbital animation */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-green-500/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-blue-500/10 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500/20 to-green-500/20 blur-2xl rounded-full"
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <FlaskConical size={32} className="md:size-[48px] text-[#4caf50] mb-2 opacity-80" />
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                          className="w-1 h-1 bg-[#4caf50] rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{t('fertigation.systemStandby')}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                    {t('fertigation.waitingTitle')}
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-white/30 font-medium max-w-sm">
                    {t('fertigation.systemHealthy')}
                  </p>

                  
                  {schedules.find(s => s.status === 'pending') && (
                    <div className="inline-flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-[#4caf50]">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">{t('fertigation.upcomingNode')}</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-white">
                          {schedules.find(s => s.status === 'pending')?.name} @ {schedules.find(s => s.status === 'pending')?.time}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Schedule List */}
          <div className="glass rounded-3xl p-8 border border-[#4caf50]/40 shadow-[0_0_20px_rgba(76,175,80,0.15)]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <Clock size={20} className="text-slate-400" />
              {t('fertigation.upcomingCycles')}
            </h3>
            <div className="space-y-4">
              {schedules.filter(s => s.status === 'pending').map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 rounded-2xl border bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-green-200 dark:hover:border-green-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40">
                      <FlaskConical size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{s.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 flex items-center gap-1">
                          <Clock size={10} /> {s.time}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 flex items-center gap-1">
                          <Zap size={10} /> {s.duration} {t('fertigation.duration').split(' ')[0].toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status="idle"
                      label={t('fertigation.pending')}
                    />
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-slate-300 dark:text-white/20 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {schedules.filter(s => s.status === 'pending').length === 0 && (
                <div className="text-center py-8 text-slate-400 dark:text-white/30 text-sm italic">
                  {t('fertigation.noUpcoming')}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ============ RIGHT ============ */}
        <div className="space-y-6">
          <MotorStatusCard
            type="fertigation"
            isOn={data.fertigationMotor}
            onToggle={toggleFertigation}
            disabled={schedules.filter(s => s.status === 'pending').length === 0 && !totalRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default FertigationScheduler;
