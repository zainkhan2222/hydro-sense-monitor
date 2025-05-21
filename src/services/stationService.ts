
import { supabase } from "@/integrations/supabase/client";
import { Station } from "@/types";

export const fetchStations = async (): Promise<Station[]> => {
  const { data, error } = await supabase
    .from("stations")
    .select("*, readings(*)");

  if (error) {
    console.error("Error fetching stations:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((station) => ({
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
    updatedAt: station.updated_at,
    // Add the latest reading if available
    lastReading: station.readings && station.readings.length > 0 
      ? {
          id: station.readings[0].id,
          stationId: station.readings[0].station_id,
          timestamp: station.readings[0].timestamp,
          deviceId: station.readings[0].device_id,
          ph: station.readings[0].ph,
          temperature: station.readings[0].temperature,
          dissolvedOxygen: station.readings[0].dissolved_oxygen,
          turbidity: station.readings[0].turbidity,
          tds: station.readings[0].tds,
          conductivity: station.readings[0].conductivity,
          createdAt: station.readings[0].created_at
        }
      : undefined
  }));
};

export const fetchStation = async (id: string): Promise<Station | null> => {
  const { data, error } = await supabase
    .from("stations")
    .select("*, readings(*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    console.error("Error fetching station:", error);
    throw error;
  }

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
    // Add the latest reading if available
    lastReading: data.readings && data.readings.length > 0 
      ? {
          id: data.readings[0].id,
          stationId: data.readings[0].station_id,
          timestamp: data.readings[0].timestamp,
          deviceId: data.readings[0].device_id,
          ph: data.readings[0].ph,
          temperature: data.readings[0].temperature,
          dissolvedOxygen: data.readings[0].dissolved_oxygen,
          turbidity: data.readings[0].turbidity,
          tds: data.readings[0].tds,
          conductivity: data.readings[0].conductivity,
          createdAt: data.readings[0].created_at
        }
      : undefined
  };
};

export const createStation = async (stationData: Omit<Station, "id" | "apiKey" | "ownerId" | "createdAt" | "updatedAt">): Promise<Station> => {
  // Get user ID from authentication
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("stations")
    .insert({
      name: stationData.name,
      description: stationData.description,
      location: stationData.location,
      latitude: stationData.latitude,
      longitude: stationData.longitude,
      is_active: stationData.isActive !== undefined ? stationData.isActive : true,
      owner_id: user.id
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

export const updateStation = async (id: string, stationData: Partial<Station>): Promise<Station> => {
  const updateData: Record<string, any> = {};
  
  if (stationData.name !== undefined) updateData.name = stationData.name;
  if (stationData.description !== undefined) updateData.description = stationData.description;
  if (stationData.location !== undefined) updateData.location = stationData.location;
  if (stationData.latitude !== undefined) updateData.latitude = stationData.latitude;
  if (stationData.longitude !== undefined) updateData.longitude = stationData.longitude;
  if (stationData.isActive !== undefined) updateData.is_active = stationData.isActive;

  const { data, error } = await supabase
    .from("stations")
    .update(updateData)
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
    console.error("Error deleting station:", error);
    throw error;
  }
};

export const regenerateApiKey = async (id: string): Promise<string> => {
  // This would normally call a server-side function to generate a new API key
  // For now, simulate by generating a random string
  const apiKey = Array(32)
    .fill(0)
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
  
  const { data, error } = await supabase
    .from("stations")
    .update({ api_key: apiKey })
    .eq("id", id)
    .select('api_key')
    .single();

  if (error) {
    console.error("Error regenerating API key:", error);
    throw error;
  }

  return data.api_key;
};
