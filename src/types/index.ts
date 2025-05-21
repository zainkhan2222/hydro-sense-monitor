
// Extending the existing types file with proper type definitions

export type ParameterType = 'ph' | 'temperature' | 'dissolvedOxygen' | 'turbidity' | 'tds' | 'conductivity';

export type DeviceType = 'arduino' | 'esp32' | 'raspberry_pi' | 'other';

export type DeviceStatus = 'online' | 'offline' | 'maintenance';

export type ParameterStatus = 'good' | 'warning' | 'danger' | 'critical';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  stationId: string;
  status: DeviceStatus;
  lastConnection: string;
  firmwareVersion: string;
  supportedParameters: ParameterType[];
  createdAt: string;
  updatedAt: string;
}

export interface Reading {
  id: string;
  stationId: string;
  timestamp: string;
  deviceId?: string;
  ph?: number;
  temperature?: number;
  dissolvedOxygen?: number;
  turbidity?: number;
  tds?: number;
  conductivity?: number;
  createdAt: string;
  // For UI component compatibility
  stationName?: string;
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

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  stationId: string;
  parameter: ParameterType;
  value: number;
  timestamp: string;
  severity: AlertSeverity;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  readingId: string;
  // For UI component compatibility
  stationName?: string;
}

export interface Station {
  id: string;
  name: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  apiKey?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  // For UI component compatibility - will be populated when needed
  lastReading?: Reading;
  devices?: Device[];
}

export interface DashboardSummary {
  totalStations: number;
  activeStations: number;
  totalAlerts: number;
  unacknowledgedAlerts: number;
  recentReadings: Reading[];
  recentAlerts: Alert[];
}
