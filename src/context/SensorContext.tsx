import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SensorData, Alert, SensorContextType, ActivityLog } from '../types/sensor';

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
  const [thresholds, setThresholds] = useState<SensorContextType['thresholds']>({
    soilMoisture: 30,
    phMin: 6.0,
    phMax: 7.5,
    tdsMax: 1200,
  });

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

  const toggleFertigation = useCallback(() => {
    setData((prev) => {
      const newState = !prev.fertigationMotor;
      addLog('fertigation', newState ? 'START' : 'STOP');
      return { ...prev, fertigationMotor: newState };
    });
  }, [addLog]);

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newMoisture = Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() * 2 - 1.1)));
        const newPh = Math.max(0, Math.min(14, prev.ph + (Math.random() * 0.1 - 0.05)));
        const newTds = Math.max(100, Math.min(2000, prev.tds + (Math.random() * 10 - 5)));

        let irrigationState = prev.irrigationMotor;

        if (isAutoMode) {
          if (newMoisture < thresholds.soilMoisture && !irrigationState) {
            if (newPh >= thresholds.phMin && newPh <= thresholds.phMax && newTds <= thresholds.tdsMax) {
              irrigationState = true;
              addAlert('info', 'Low moisture detected. Auto-irrigation ON.');
              addLog('irrigation', 'START');
            } else {
              addAlert('warning', 'Low moisture detected but safety lock active!');
            }
          } else if (newMoisture > 80 && irrigationState) {
            irrigationState = false;
            addAlert('success', 'Soil moisture restored. Auto-irrigation OFF.');
            addLog('irrigation', 'STOP');
          }
        }

        if (irrigationState && (newPh < thresholds.phMin || newPh > thresholds.phMax)) {
          irrigationState = false;
          addAlert('error', 'EMERGENCY SHUTDOWN: Abnormal pH detected!');
          addLog('irrigation', 'STOP');
        }
        if (irrigationState && newTds > thresholds.tdsMax) {
          irrigationState = false;
          addAlert('error', 'EMERGENCY SHUTDOWN: High salinity detected!');
          addLog('irrigation', 'STOP');
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
      toggleIrrigation, 
      toggleFertigation, 
      updateThresholds,
      toggleAutoMode,
      setSoilMoistureThreshold: (val) => updateThresholds({ soilMoisture: val })
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

