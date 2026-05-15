import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData, Alert, SensorContextType, ActivityLog, Schedule } from '../types/sensor';

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SensorData>({
    soilMoisture: 68.5,
    ph: 6.7,
    tds: 580,
    irrigationMotor: false,
    fertigationMotor: false,
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [thresholds, setThresholds] = useState<SensorContextType['thresholds']>({
    moistureOn: 62,
    moistureOff: 72,
    phMin: 6.4,
    phMax: 7.1,
    tdsMax: 750,
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const motorFired = useRef(false);

  const addAlert = useCallback((type: Alert['type'], message: string) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
  }, []);

  const addLog = useCallback((type: 'irrigation' | 'fertigation', action: 'START' | 'STOP') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      action,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 20));
  }, []);

  const updateThresholds = useCallback((newThresholds: Partial<SensorContextType['thresholds']>) => {
    setThresholds((prev) => ({ ...prev, ...newThresholds }));
  }, []);

  const toggleAutoMode = useCallback(() => {
    setIsAutoMode((prev) => !prev);
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const newState = !prev;
      if (newState) {
        addAlert('info', 'Demo Mode Activated: Simulating critical scenario...');
        // Force motor on for demo
        setData(d => ({ ...d, irrigationMotor: true }));
        addLog('irrigation', 'START');
      } else {
        addAlert('success', 'Demo Mode Deactivated. Resuming normal operations.');
      }
      return newState;
    });
  }, [addAlert, addLog]);

  const toggleIrrigation = useCallback(() => {
    setData((prev) => {
      const newState = !prev.irrigationMotor;
      if (newState) {
        if (prev.ph < thresholds.phMin || prev.ph > thresholds.phMax) {
          addAlert('error', 'Irrigation blocked: pH levels abnormal!');
          return prev;
        }
        if (prev.tds > thresholds.tdsMax) {
          addAlert('error', 'Irrigation blocked: High salinity detected!');
          return prev;
        }
      }
      addLog('irrigation', newState ? 'START' : 'STOP');
      return { ...prev, irrigationMotor: newState };
    });
  }, [addAlert, addLog, thresholds]);

  const toggleFertigation = useCallback((duration?: number) => {
    setData((prev) => {
      const newState = !prev.fertigationMotor;
      
      if (newState) {
        // Starting motor: find last schedule duration or use provided
        let targetDuration = duration;
        if (!targetDuration) {
          // Find last added schedule
          if (schedules.length > 0) {
            targetDuration = schedules[schedules.length - 1].duration;
          } else {
            targetDuration = 10; // Default fallback
          }
        }

        setSchedules(prevS => {
          // If there's an existing schedule, use its duration and mark as running
          // Otherwise create a manual one
          const last = prevS[prevS.length - 1];
          if (last && last.status !== 'running') {
            return prevS.map(s => s.id === last.id ? { ...s, status: 'running' as const, timeLeft: targetDuration! * 60 } : s);
          } else if (!last || last.status === 'completed') {
            return [...prevS, {
              id: Date.now(),
              name: 'Manual Cycle',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              duration: targetDuration!,
              status: 'running',
              timeLeft: targetDuration! * 60
            }];
          }
          return prevS;
        });
      } else {
        // Stopping motor
        setSchedules(prevS => prevS.map(s => s.status === 'running' ? { ...s, status: 'completed' as const, timeLeft: 0 } : s));
      }

      addLog('fertigation', newState ? 'START' : 'STOP');
      return { ...prev, fertigationMotor: newState };
    });
  }, [addLog, schedules]);

  // Fertigation schedule & countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hhmm = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setSchedules(prev => prev.map(s => {
        // Auto-start based on time
        if (s.status === 'pending' && s.time === hhmm) {
          if (!data.fertigationMotor && !motorFired.current) {
            motorFired.current = true;
            setData(d => ({ ...d, fertigationMotor: true }));
            addLog('fertigation', 'START');
          }
          return { ...s, status: 'running', timeLeft: s.duration * 60 };
        }
        
        // Countdown
        if (s.status === 'running' && s.timeLeft !== undefined) {
          if (s.timeLeft <= 1) {
            if (data.fertigationMotor) {
              setData(d => ({ ...d, fertigationMotor: false }));
              addLog('fertigation', 'STOP');
            }
            motorFired.current = false;
            return { ...s, status: 'completed', timeLeft: 0 };
          }
          return { ...s, timeLeft: s.timeLeft - 1 };
        }
        return s;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [data.fertigationMotor, addLog]);

  // Simulation loop (Sensor data)
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        let newMoisture, newPh, newTds;

        if (isDemoMode) {
          // In demo mode, force values into critical zones to show alerts
          newMoisture = Math.max(60, Math.min(75, prev.soilMoisture + 0.1));
          newPh = prev.ph + 0.05; // Rapidly rise to trigger pH alert (> 7.1)
          newTds = prev.tds + 10; // Rapidly rise to trigger TDS alert (> 750)
        } else {
          // Natural drift within user-defined ranges
          newMoisture = Math.max(60, Math.min(75, prev.soilMoisture + (Math.random() * 0.4 - 0.2)));
          newPh = Math.max(6.5, Math.min(7, prev.ph + (Math.random() * 0.02 - 0.01)));
          newTds = Math.max(500, Math.min(700, prev.tds + (Math.random() * 4 - 2)));
        }

        let irrigationState = prev.irrigationMotor;

        if (isAutoMode) {
          if (newMoisture < thresholds.moistureOn && !irrigationState) {
            if (newPh >= thresholds.phMin && newPh <= thresholds.phMax && newTds <= thresholds.tdsMax) {
              irrigationState = true;
              addAlert('info', 'Low moisture detected. Auto-irrigation ON.');
              addLog('irrigation', 'START');
            } else {
              addAlert('warning', 'Low moisture detected but safety lock active!');
            }
          } else if (newMoisture > thresholds.moistureOff && irrigationState) {
            irrigationState = false;
            addAlert('success', 'Soil moisture restored. Auto-irrigation OFF.');
            addLog('irrigation', 'STOP');
          }
        }

        if (irrigationState && (newPh < thresholds.phMin || newPh > thresholds.phMax)) {
          irrigationState = false;
          addAlert('error', `EMERGENCY SHUTDOWN: Abnormal pH detected (${newPh.toFixed(1)})!`);
          addLog('irrigation', 'STOP');
        } else if (!irrigationState && (newPh < thresholds.phMin || newPh > thresholds.phMax)) {
          addAlert('warning', `System Alert: Abnormal pH detected (${newPh.toFixed(1)})! Check sensor nodes.`);
        }

        if (irrigationState && newTds > thresholds.tdsMax) {
          irrigationState = false;
          addAlert('error', `EMERGENCY SHUTDOWN: High salinity detected (${newTds.toFixed(0)} ppm)!`);
          addLog('irrigation', 'STOP');
        } else if (!irrigationState && newTds > thresholds.tdsMax) {
          addAlert('warning', `System Alert: High TDS detected (${newTds.toFixed(0)} ppm)! Nutrient levels exceed safety threshold.`);
        }

        return {
          ...prev,
          soilMoisture: newMoisture,
          ph: newPh,
          tds: newTds,
          irrigationMotor: irrigationState,
          lastUpdate: new Date().toLocaleTimeString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [thresholds, addAlert, addLog, isAutoMode]);

  return (
    <SensorContext.Provider value={{ 
      data, 
      alerts, 
      logs,
      thresholds, 
      isAutoMode,
      isDemoMode,
      toggleDemoMode,
      pushNotifications,
      setPushNotifications,
      emailAlerts,
      setEmailAlerts,
      toggleIrrigation, 
      toggleFertigation, 
      updateThresholds,
      toggleAutoMode,
      schedules,
      setSchedules,
    }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = () => {
  const context = useContext(SensorContext);
  if (!context) throw new Error('useSensors must be used within SensorProvider');
  return context;
};


