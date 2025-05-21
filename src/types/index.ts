
export type UserRole = 'admin' | 'sensor_owner' | 'viewer';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
}

export interface Station {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  apiKey?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastReading?: Reading;
  devices?: Device[];
}

export type ParameterType = 'pH' | 'temperature' | 'dissolvedOxygen' | 'turbidity' | 'tds' | 'conductivity';

export type ParameterStatus = 'good' | 'warning' | 'danger' | 'critical';

export interface Reading {
  id: string;
  stationId: string;
  timestamp: string;
  parameters: {
    pH?: number;
    temperature?: number;
    dissolvedOxygen?: number;
    turbidity?: number;
    tds?: number;
    conductivity?: number;
    [key: string]: number | undefined;
  };
  deviceId?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'arduino' | 'esp32' | 'raspberry_pi' | 'other';
  stationId: string;
  status: 'online' | 'offline' | 'maintenance';
  lastConnection: string;
  firmwareVersion?: string;
  supportedParameters: ParameterType[];
  createdAt: string;
  updatedAt: string;
}

export interface Threshold {
  id: string;
  stationId: string;
  parameter: ParameterType;
  minValue: number;
  maxValue: number;
  criticalMin?: number;
  criticalMax?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  stationId: string;
  parameter: ParameterType;
  value: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  readingId: string;
}

export interface DashboardSummary {
  totalStations: number;
  activeStations: number;
  totalAlerts: number;
  unacknowledgedAlerts: number;
  recentReadings: Reading[];
  recentAlerts: Alert[];
}
