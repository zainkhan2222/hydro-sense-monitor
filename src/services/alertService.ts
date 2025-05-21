
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/types";

export const fetchAlerts = async (limit: number = 50): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from("alerts")
    .select(`
      *,
      stations(name)
    `)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((alert) => ({
    id: alert.id,
    stationId: alert.station_id,
    parameter: alert.parameter as any,
    value: alert.value,
    timestamp: alert.timestamp,
    severity: alert.severity as any,
    acknowledged: alert.acknowledged,
    acknowledgedBy: alert.acknowledged_by,
    acknowledgedAt: alert.acknowledged_at,
    readingId: alert.reading_id,
    stationName: alert.stations?.name // Add station name for easier reference
  }));
};

export const fetchAlertsByStationId = async (stationId: string, limit: number = 50): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("station_id", stationId)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((alert) => ({
    id: alert.id,
    stationId: alert.station_id,
    parameter: alert.parameter as any,
    value: alert.value,
    timestamp: alert.timestamp,
    severity: alert.severity as any,
    acknowledged: alert.acknowledged,
    acknowledgedBy: alert.acknowledged_by,
    acknowledgedAt: alert.acknowledged_at,
    readingId: alert.reading_id
  }));
};

export const acknowledgeAlert = async (alertId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from("alerts")
    .update({
      acknowledged: true,
      acknowledged_by: userId,
      acknowledged_at: new Date().toISOString()
    })
    .eq("id", alertId);

  if (error) {
    console.error("Error acknowledging alert:", error);
    throw error;
  }
};

export const getUnacknowledgedAlertsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("acknowledged", false);

  if (error) {
    console.error("Error counting unacknowledged alerts:", error);
    throw error;
  }

  return count ?? 0;
};
