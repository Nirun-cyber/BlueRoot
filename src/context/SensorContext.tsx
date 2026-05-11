import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData, Alert, SensorContextType, ActivityLog, Schedule } from '../types/sensor';

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SensorData>({
    soilMoisture: 45,
    ph: 6.8,
    tds: 750,
    irrigationMotor: false,
    fertigationMotor: false,
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [thresholds, setThresholds] = useState<SensorContextType['thresholds']>({
    moistureOn: 30,
    moistureOff: 80,
    phMin: 6.0,
    phMax: 7.5,
    tdsMax: 1200,
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
        const newMoisture = Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() * 2 - 1.1)));
        const newPh = Math.max(0, Math.min(14, prev.ph + (Math.random() * 0.1 - 0.05)));
        const newTds = Math.max(100, Math.min(2000, prev.tds + (Math.random() * 10 - 5)));

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


