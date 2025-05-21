
import { supabase } from "@/integrations/supabase/client";
import { Station } from "@/types";

export const fetchStations = async (): Promise<Station[]> => {
  const { data, error } = await supabase
    .from("stations")
    .select(`
      *,
      lastReading:readings(
        id,
        timestamp,
        ph,
        temperature,
        dissolved_oxygen,
        turbidity,
        tds,
        conductivity
      )
    `)
    .order("created_at", { ascending: false })
    .limit(1, { foreignTable: "readings" });

  if (error) {
    console.error("Error fetching stations:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((station) => ({
    id: station.id,
    name: station.name,
    description: station.description || "",
    location: station.location,
    latitude: station.latitude,
    longitude: station.longitude,
    isActive: station.is_active,
    apiKey: station.api_key,
    ownerId: station.owner_id,
    createdAt: station.created_at,
    updatedAt: station.updated_at,
    lastReading: station.lastReading?.[0] ? {
      id: station.lastReading[0].id,
      stationId: station.id,
      timestamp: station.lastReading[0].timestamp,
      parameters: {
        pH: station.lastReading[0].ph,
        temperature: station.lastReading[0].temperature,
        dissolvedOxygen: station.lastReading[0].dissolved_oxygen,
        turbidity: station.lastReading[0].turbidity,
        tds: station.lastReading[0].tds,
        conductivity: station.lastReading[0].conductivity,
      }
    } : undefined
  }));
};

export const fetchStationById = async (id: string): Promise<Station> => {
  const { data, error } = await supabase
    .from("stations")
    .select(`
      *,
      devices(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching station:", error);
    throw error;
  }

  // Transform the data to match our types
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    devices: data.devices?.map((device) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      stationId: device.station_id,
      status: device.status,
      lastConnection: device.last_connection,
      firmwareVersion: device.firmware_version,
      supportedParameters: device.supported_parameters,
      createdAt: device.created_at,
      updatedAt: device.updated_at,
    }))
  };
};

export const createStation = async (stationData: Partial<Station>): Promise<Station> => {
  const { data, error } = await supabase
    .from("stations")
    .insert({
      name: stationData.name,
      description: stationData.description,
      location: stationData.location,
      latitude: stationData.latitude,
      longitude: stationData.longitude,
      is_active: stationData.isActive ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating station:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const updateStation = async (id: string, stationData: Partial<Station>): Promise<Station> => {
  const { data, error } = await supabase
    .from("stations")
    .update({
      name: stationData.name,
      description: stationData.description,
      location: stationData.location,
      latitude: stationData.latitude,
      longitude: stationData.longitude,
      is_active: stationData.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating station:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const deleteStation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("stations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting station:", error);
    throw error;
  }
};

export const regenerateApiKey = async (id: string): Promise<string> => {
  // Generate a new API key
  const newApiKey = crypto.randomUUID();
  
  const { error } = await supabase
    .from("stations")
    .update({
      api_key: newApiKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error regenerating API key:", error);
    throw error;
  }

  return newApiKey;
};
