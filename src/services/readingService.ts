
import { supabase } from "@/integrations/supabase/client";
import { Reading } from "@/types";

export const fetchReadings = async (stationId: string): Promise<Reading[]> => {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("station_id", stationId)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching readings:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((reading) => ({
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
    console.error("Error fetching readings by date range:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((reading) => ({
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
};

export const createReading = async (readingData: Omit<Reading, "id" | "createdAt">): Promise<Reading> => {
  const { data, error } = await supabase
    .from("readings")
    .insert({
      station_id: readingData.stationId,
      timestamp: readingData.timestamp,
      device_id: readingData.deviceId,
      ph: readingData.ph,
      temperature: readingData.temperature,
      dissolved_oxygen: readingData.dissolvedOxygen,
      turbidity: readingData.turbidity,
      tds: readingData.tds,
      conductivity: readingData.conductivity
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating reading:", error);
    throw error;
  }

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
