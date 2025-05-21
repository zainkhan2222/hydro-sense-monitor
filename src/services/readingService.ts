
import { supabase } from "@/integrations/supabase/client";
import { Reading, ParameterType } from "@/types";

export const fetchReadings = async (stationId: string, limit = 100): Promise<Reading[]> => {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("station_id", stationId)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Reading interface
  const readings: Reading[] = data.map((reading) => ({
    id: reading.id,
    stationId: reading.station_id,
    timestamp: reading.timestamp,
    deviceId: reading.device_id,
    ph: reading.ph,
    temperature: reading.temperature,
    dissolvedOxygen: reading.dissolved_oxygen,
    turbidity: reading.turbidity,
    tds: reading.tds,
    conductivity: reading.conductivity,
    createdAt: reading.created_at
  }));

  return readings;
};

export const fetchRecentReadings = async (stationId: string, hours = 24): Promise<Reading[]> => {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);
  
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("station_id", stationId)
    .gte("timestamp", startDate.toISOString())
    .order("timestamp", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Reading interface
  const readings: Reading[] = data.map((reading) => ({
    id: reading.id,
    stationId: reading.station_id,
    timestamp: reading.timestamp,
    deviceId: reading.device_id,
    ph: reading.ph,
    temperature: reading.temperature,
    dissolvedOxygen: reading.dissolved_oxygen,
    turbidity: reading.turbidity,
    tds: reading.tds,
    conductivity: reading.conductivity,
    createdAt: reading.created_at
  }));

  return readings;
};

export const fetchReadingsByDateRange = async (
  stationId: string,
  startDate: Date,
  endDate: Date
): Promise<Reading[]> => {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("station_id", stationId)
    .gte("timestamp", startDate.toISOString())
    .lte("timestamp", endDate.toISOString())
    .order("timestamp", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Reading interface
  const readings: Reading[] = data.map((reading) => ({
    id: reading.id,
    stationId: reading.station_id,
    timestamp: reading.timestamp,
    deviceId: reading.device_id,
    ph: reading.ph,
    temperature: reading.temperature,
    dissolvedOxygen: reading.dissolved_oxygen,
    turbidity: reading.turbidity,
    tds: reading.tds,
    conductivity: reading.conductivity,
    createdAt: reading.created_at
  }));

  return readings;
};

export const createReading = async (reading: Omit<Reading, "id" | "createdAt">): Promise<Reading> => {
  const { data, error } = await supabase
    .from("readings")
    .insert({
      station_id: reading.stationId,
      timestamp: reading.timestamp,
      device_id: reading.deviceId,
      ph: reading.ph,
      temperature: reading.temperature,
      dissolved_oxygen: reading.dissolvedOxygen,
      turbidity: reading.turbidity,
      tds: reading.tds,
      conductivity: reading.conductivity
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Reading interface
  return {
    id: data.id,
    stationId: data.station_id,
    timestamp: data.timestamp,
    deviceId: data.device_id,
    ph: data.ph,
    temperature: data.temperature,
    dissolvedOxygen: data.dissolved_oxygen,
    turbidity: data.turbidity,
    tds: data.tds,
    conductivity: data.conductivity,
    createdAt: data.created_at
  };
};

// For compatibility with existing code
export const fetchReadingsByStationId = fetchReadings;
export const fetchReadingsForAnalysis = async (
  stationId: string,
  parameter: string,
  startDate: Date,
  endDate: Date
): Promise<Reading[]> => {
  return fetchReadingsByDateRange(stationId, startDate, endDate);
};
