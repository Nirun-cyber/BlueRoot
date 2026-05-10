export interface SensorData {
  soilMoisture: number;
  ph: number;
  tds: number;
  irrigationMotor: boolean;
  fertigationMotor: boolean;
  lastUpdate: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  type: 'irrigation' | 'fertigation';
  action: 'START' | 'STOP';
  timestamp: string;
}

export interface SensorContextType {
  data: SensorData;
  alerts: Alert[];
  logs: ActivityLog[];
  thresholds: {
    soilMoisture: number;
    phMin: number;
    phMax: number;
    tdsMax: number;
  };
  isAutoMode: boolean;
  pushNotifications: boolean;
  setPushNotifications: (val: boolean) => void;
  emailAlerts: boolean;
  setEmailAlerts: (val: boolean) => void;
  toggleIrrigation: () => void;
  toggleFertigation: () => void;
  updateThresholds: (newThresholds: Partial<SensorContextType['thresholds']>) => void;
  toggleAutoMode: () => void;
  setSoilMoistureThreshold: (val: number) => void;
}
