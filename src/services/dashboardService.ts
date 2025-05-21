
import { supabase } from "@/integrations/supabase/client";
import { DashboardSummary, Alert, Reading } from "@/types";

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  // Fetch total stations count
  const { count: totalStations, error: stationsError } = await supabase
    .from("stations")
    .select("*", { count: "exact", head: true });

  if (stationsError) {
    console.error("Error fetching stations count:", stationsError);
    throw stationsError;
  }

  // Fetch active stations count
  const { count: activeStations, error: activeStationsError } = await supabase
    .from("stations")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (activeStationsError) {
    console.error("Error fetching active stations count:", activeStationsError);
    throw activeStationsError;
  }

  // Fetch total alerts count
  const { count: totalAlerts, error: alertsError } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true });

  if (alertsError) {
    console.error("Error fetching alerts count:", alertsError);
    throw alertsError;
  }

  // Fetch unacknowledged alerts count
  const { count: unacknowledgedAlerts, error: unackError } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("acknowledged", false);

  if (unackError) {
    console.error("Error fetching unacknowledged alerts count:", unackError);
    throw unackError;
  }

  // Fetch recent readings
  const { data: recentReadings, error: readingsError } = await supabase
    .from("readings")
    .select(`
      *,
      stations(name)
    `)
    .order("timestamp", { ascending: false })
    .limit(5);

  if (readingsError) {
    console.error("Error fetching recent readings:", readingsError);
    throw readingsError;
  }

  // Fetch recent alerts
  const { data: recentAlerts, error: recentAlertsError } = await supabase
    .from("alerts")
    .select(`
      *,
      stations(name)
    `)
    .order("timestamp", { ascending: false })
    .limit(5);

  if (recentAlertsError) {
    console.error("Error fetching recent alerts:", recentAlertsError);
    throw recentAlertsError;
  }

  // Transform readings to match our types
  const transformedReadings: Reading[] = recentReadings.map((reading: any) => ({
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
    createdAt: reading.created_at,
    stationName: reading.stations?.name
  }));

  // Transform alerts to match our types
  const transformedAlerts: Alert[] = recentAlerts.map((alert: any) => ({
    id: alert.id,
    stationId: alert.station_id,
    parameter: alert.parameter,
    value: alert.value,
    timestamp: alert.timestamp,
    severity: alert.severity,
    acknowledged: alert.acknowledged,
    acknowledgedBy: alert.acknowledged_by,
    acknowledgedAt: alert.acknowledged_at,
    readingId: alert.reading_id,
    stationName: alert.stations?.name
  }));

  return {
    totalStations: totalStations || 0,
    activeStations: activeStations || 0,
    totalAlerts: totalAlerts || 0,
    unacknowledgedAlerts: unacknowledgedAlerts || 0,
    recentReadings: transformedReadings,
    recentAlerts: transformedAlerts
  };
};
