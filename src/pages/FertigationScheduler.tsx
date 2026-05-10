import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  FlaskConical, 
  Zap,
  CheckCircle2,
  MoreVertical,
  X,
  Timer,
  Trash2
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

const FertigationScheduler: React.FC = () => {
  const { data, toggleFertigation } = useSensors();

  // Ref to trigger the native time picker on container click
  const timeInputRef = useRef<HTMLInputElement>(null);

  // ------ Active cycle countdown (tracks the running schedule) ------
  const [activeTimeLeft, setActiveTimeLeft] = useState(0);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, name: 'Nitro-Boost Cycle',  time: '08:00', duration: 15, status: 'completed' },
    { id: 2, name: 'Potassium Mix',       time: '12:30', duration: 10, status: 'running', timeLeft: 480 },
    { id: 3, name: 'Micronutrient Mix',   time: '16:00', duration: 20, status: 'pending' },
  ]);

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
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto relative">

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
              <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 border border-purple-200 dark:border-purple-500/30 shadow-2xl shadow-purple-500/10">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Timer size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">New Fertigation Schedule</h3>
                      <p className="text-xs text-slate-400 dark:text-white/40">Set time & duration for auto motor control</p>
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
                      Cycle Name <span className="text-slate-300">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Morning NPK Boost"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-white/20 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    {/* Clickable container opens the native time picker */}
                    <div
                      className="relative cursor-pointer"
                      onClick={() => timeInputRef.current?.showPicker?.()}
                    >
                      <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                      <input
                        ref={timeInputRef}
                        type="time"
                        value={newTime}
                        onChange={e => setNewTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-white/30">
                      Motor will auto-start at this time exactly.
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                      Duration (minutes) <span className="text-red-400">*</span>
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
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-white/20 focus:outline-none focus:border-purple-400 transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-white/30">
                      Motor will auto-stop after this many minutes.
                    </p>
                  </div>

                  {/* Info box */}
                  {newTime && newDuration && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-100 dark:border-purple-500/20">
                      <FlaskConical size={16} className="text-purple-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-purple-700 dark:text-purple-300 font-medium leading-relaxed">
                        Fertigation motor will turn <strong>ON</strong> at <strong>{newTime}</strong> and automatically turn <strong>OFF</strong> after <strong>{newDuration} minute{Number(newDuration) !== 1 ? 's' : ''}</strong>.
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
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSchedule}
                    disabled={!newTime || !newDuration}
                    className="flex-1 py-3 rounded-xl bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Add Schedule
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
            <Calendar size={32} className="text-purple-500" />
            Fertigation Scheduler
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">Schedule and monitor nutrient distribution</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 hover:bg-purple-600 transition-all"
        >
          <Plus size={18} />
          New Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ============ LEFT ============ */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Cycle countdown */}
          <div className="glass rounded-[2rem] p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="relative shrink-0">
              <svg className="w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-white/5" />
                <motion.circle
                  cx="96" cy="96" r="88"
                  stroke="#a855f7" strokeWidth="8" fill="none"
                  strokeDasharray={2 * Math.PI * 88}
                  animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - activeTimeLeft / totalSeconds) }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Remaining</p>
                <p className="text-4xl font-bold font-mono text-slate-800 dark:text-white">{formatTime(activeTimeLeft)}</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <StatusBadge
                  status={data.fertigationMotor ? 'active' : 'idle'}
                  label={data.fertigationMotor ? 'Cycle In Progress' : 'System Ready'}
                />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
                  {totalRunning?.name ?? 'No Active Cycle'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/60 mt-1">
                  {totalRunning
                    ? `Running for ${totalRunning.duration} min — motor stops automatically.`
                    : 'Add a schedule or wait for the next scheduled cycle.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase mb-1">Start Time</p>
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{totalRunning?.time ?? '—'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase mb-1">Duration</p>
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{totalRunning ? `${totalRunning.duration} min` : '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule List */}
          <div className="glass rounded-3xl p-8 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <Clock size={20} className="text-slate-400" />
              Scheduled Cycles
            </h3>
            <div className="space-y-4">
              {schedules.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    s.status === 'running'
                      ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30'
                      : s.status === 'completed'
                        ? 'bg-green-50/50 dark:bg-[#1e9a4e]/5 border-green-100 dark:border-[#1e9a4e]/20'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-purple-200 dark:hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      s.status === 'running'   ? 'bg-purple-500 text-white animate-pulse' :
                      s.status === 'completed' ? 'bg-green-100 dark:bg-[#1e9a4e]/20 text-[#1e9a4e]' :
                      'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40'
                    }`}>
                      {s.status === 'completed' ? <CheckCircle2 size={24} /> : <FlaskConical size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{s.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 flex items-center gap-1">
                          <Clock size={10} /> {s.time}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 flex items-center gap-1">
                          <Zap size={10} /> {s.duration} min
                        </span>
                        {s.status === 'running' && s.timeLeft !== undefined && (
                          <span className="text-[10px] font-bold text-purple-500 flex items-center gap-1">
                            <Timer size={10} /> {formatTime(s.timeLeft)} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={s.status === 'completed' ? 'healthy' : s.status === 'running' ? 'active' : 'idle'}
                      label={s.status}
                    />
                    {s.status === 'pending' && (
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-slate-300 dark:text-white/20 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {s.status !== 'pending' && (
                      <button className="text-slate-300 dark:text-white/20 hover:text-slate-600 dark:hover:text-white transition-colors p-1">
                        <MoreVertical size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {schedules.length === 0 && (
                <div className="text-center py-8 text-slate-400 dark:text-white/30 text-sm">
                  No schedules yet. Click "New Schedule" to add one.
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
          />
        </div>
      </div>
    </div>
  );
};

export default FertigationScheduler;
