
import { supabase } from "@/integrations/supabase/client";
import { Reading } from "@/types";

export const fetchReadingsByStationId = async (stationId: string, limit: number = 50): Promise<Reading[]> => {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("station_id", stationId)
    .order("timestamp", { ascending: false })
    .limit(limit);

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
    parameters: {
      pH: reading.ph,
      temperature: reading.temperature,
      dissolvedOxygen: reading.dissolved_oxygen,
      turbidity: reading.turbidity,
      tds: reading.tds,
      conductivity: reading.conductivity,
    }
  }));
};

export const createReading = async (readingData: Partial<Reading>): Promise<Reading> => {
  const { data, error } = await supabase
    .from("readings")
    .insert({
      station_id: readingData.stationId,
      device_id: readingData.deviceId,
      ph: readingData.parameters?.pH,
      temperature: readingData.parameters?.temperature,
      dissolved_oxygen: readingData.parameters?.dissolvedOxygen,
      turbidity: readingData.parameters?.turbidity,
      tds: readingData.parameters?.tds,
      conductivity: readingData.parameters?.conductivity,
      timestamp: readingData.timestamp || new Date().toISOString(),
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
    parameters: {
      pH: data.ph,
      temperature: data.temperature,
      dissolvedOxygen: data.dissolved_oxygen,
      turbidity: data.turbidity,
      tds: data.tds,
      conductivity: data.conductivity,
    }
  };
};

export const fetchReadingsForAnalysis = async (
  stationId: string, 
  parameter: string, 
  startDate: Date, 
  endDate: Date
): Promise<{ timestamp: string; value: number }[]> => {
  // Convert parameter name to database column name
  const parameterMap: { [key: string]: string } = {
    "pH": "ph",
    "temperature": "temperature",
    "dissolvedOxygen": "dissolved_oxygen",
    "turbidity": "turbidity",
    "tds": "tds",
    "conductivity": "conductivity"
  };
  
  const columnName = parameterMap[parameter] || parameter;
  
  const { data, error } = await supabase
    .from("readings")
    .select(`timestamp, ${columnName}`)
    .eq("station_id", stationId)
    .gte("timestamp", startDate.toISOString())
    .lte("timestamp", endDate.toISOString())
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("Error fetching readings for analysis:", error);
    throw error;
  }

  // Transform the data to a format suitable for charts
  return data
    .filter(item => item[columnName] !== null) // Filter out null values
    .map((item) => ({
      timestamp: item.timestamp,
      value: item[columnName]
    }));
};
