
import { supabase } from "@/integrations/supabase/client";
import { Station } from "@/types";

export const fetchStations = async (): Promise<Station[]> => {
  const { data, error } = await supabase
    .from("stations")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Station interface
  const stations: Station[] = data.map((station) => ({
    id: station.id,
    name: station.name,
    description: station.description,
    location: station.location,
    latitude: station.latitude,
    longitude: station.longitude,
    isActive: station.is_active,
    apiKey: station.api_key,
    ownerId: station.owner_id,
    createdAt: station.created_at,
    updatedAt: station.updated_at
  }));

  return stations;
};

export const fetchStation = async (id: string): Promise<Station> => {
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Station interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const fetchStationWithDevices = async (id: string): Promise<Station> => {
  const { data, error } = await supabase
    .from("stations")
    .select(`
      *,
      devices:devices(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Station interface with devices
  const devices = data.devices.map((device: any) => ({
    id: device.id,
    name: device.name,
    type: device.type,
    stationId: device.station_id,
    status: device.status,
    lastConnection: device.last_connection,
    firmwareVersion: device.firmware_version || "",
    supportedParameters: device.supported_parameters,
    createdAt: device.created_at,
    updatedAt: device.updated_at
  }));

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    devices
  };
};

export const createStation = async (
  station: Omit<Station, "id" | "apiKey" | "ownerId" | "createdAt" | "updatedAt">
): Promise<Station> => {
  // Get the current user id
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("User must be logged in to create a station");
  }

  const { data, error } = await supabase
    .from("stations")
    .insert({
      name: station.name,
      description: station.description,
      location: station.location,
      latitude: station.latitude,
      longitude: station.longitude,
      is_active: station.isActive,
      owner_id: session.user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Station interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateStation = async (
  id: string,
  station: Partial<Station>
): Promise<Station> => {
  const { data, error } = await supabase
    .from("stations")
    .update({
      name: station.name,
      description: station.description,
      location: station.location,
      latitude: station.latitude,
      longitude: station.longitude,
      is_active: station.isActive
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Station interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteStation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("stations")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

export const regenerateApiKey = async (id: string): Promise<Station> => {
  // Generate a new API key and update the station
  const newApiKey = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
  
  const { data, error } = await supabase
    .from("stations")
    .update({ api_key: newApiKey })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Station interface
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.is_active,
    apiKey: data.api_key,
    ownerId: data.owner_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// For compatibility
export const fetchStationById = fetchStation;
