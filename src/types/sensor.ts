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

export interface Schedule {
  id: number;
  name: string;
  time: string;   // "HH:MM" 24-hr format
  duration: number; // minutes
  status: 'pending' | 'running' | 'completed';
  timeLeft?: number; // seconds remaining when running
}

export interface SensorContextType {
  data: SensorData;
  alerts: Alert[];
  logs: ActivityLog[];
  thresholds: {
    moistureOn: number;
    moistureOff: number;
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
  toggleFertigation: (duration?: number) => void;
  updateThresholds: (newThresholds: Partial<SensorContextType['thresholds']>) => void;
  toggleAutoMode: () => void;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

