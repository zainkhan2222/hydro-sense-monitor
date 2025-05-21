
import { supabase } from "@/integrations/supabase/client";
import { Threshold } from "@/types";

export const fetchThresholdsByStationId = async (stationId: string): Promise<Threshold[]> => {
  const { data, error } = await supabase
    .from("thresholds")
    .select("*")
    .eq("station_id", stationId);

  if (error) {
    console.error("Error fetching thresholds:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((threshold) => ({
    id: threshold.id,
    stationId: threshold.station_id,
    parameter: threshold.parameter as any,
    minValue: threshold.min_value,
    maxValue: threshold.max_value,
    criticalMin: threshold.critical_min,
    criticalMax: threshold.critical_max,
    createdAt: threshold.created_at,
    updatedAt: threshold.updated_at
  }));
};

export const createThreshold = async (thresholdData: Partial<Threshold>): Promise<Threshold> => {
  const { data, error } = await supabase
    .from("thresholds")
    .insert({
      station_id: thresholdData.stationId,
      parameter: thresholdData.parameter,
      min_value: thresholdData.minValue,
      max_value: thresholdData.maxValue,
      critical_min: thresholdData.criticalMin,
      critical_max: thresholdData.criticalMax
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating threshold:", error);
    throw error;
  }

  return {
    id: data.id,
    stationId: data.station_id,
    parameter: data.parameter as any,
    minValue: data.min_value,
    maxValue: data.max_value,
    criticalMin: data.critical_min,
    criticalMax: data.critical_max,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateThreshold = async (id: string, thresholdData: Partial<Threshold>): Promise<Threshold> => {
  const { data, error } = await supabase
    .from("thresholds")
    .update({
      min_value: thresholdData.minValue,
      max_value: thresholdData.maxValue,
      critical_min: thresholdData.criticalMin,
      critical_max: thresholdData.criticalMax,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating threshold:", error);
    throw error;
  }

  return {
    id: data.id,
    stationId: data.station_id,
    parameter: data.parameter as any,
    minValue: data.min_value,
    maxValue: data.max_value,
    criticalMin: data.critical_min,
    criticalMax: data.critical_max,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteThreshold = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("thresholds")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting threshold:", error);
    throw error;
  }
};
