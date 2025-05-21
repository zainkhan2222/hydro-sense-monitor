
import { supabase } from "@/integrations/supabase/client";
import { Device } from "@/types";

export const fetchDevicesByStationId = async (stationId: string): Promise<Device[]> => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("station_id", stationId);

  if (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }

  // Transform the data to match our types
  return data.map((device) => ({
    id: device.id,
    name: device.name,
    type: device.type as any,
    stationId: device.station_id,
    status: device.status as any,
    lastConnection: device.last_connection,
    firmwareVersion: device.firmware_version,
    supportedParameters: device.supported_parameters,
    createdAt: device.created_at,
    updatedAt: device.updated_at
  }));
};

export const createDevice = async (deviceData: Partial<Device>): Promise<Device> => {
  const { data, error } = await supabase
    .from("devices")
    .insert({
      name: deviceData.name,
      type: deviceData.type,
      station_id: deviceData.stationId,
      status: deviceData.status || "offline",
      firmware_version: deviceData.firmwareVersion,
      supported_parameters: deviceData.supportedParameters || []
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating device:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type as any,
    stationId: data.station_id,
    status: data.status as any,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version,
    supportedParameters: data.supported_parameters,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateDevice = async (id: string, deviceData: Partial<Device>): Promise<Device> => {
  const { data, error } = await supabase
    .from("devices")
    .update({
      name: deviceData.name,
      type: deviceData.type,
      status: deviceData.status,
      firmware_version: deviceData.firmwareVersion,
      supported_parameters: deviceData.supportedParameters,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating device:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type as any,
    stationId: data.station_id,
    status: data.status as any,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version,
    supportedParameters: data.supported_parameters,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteDevice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("devices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};

export const updateDeviceStatus = async (id: string, status: 'online' | 'offline' | 'maintenance'): Promise<void> => {
  const { error } = await supabase
    .from("devices")
    .update({
      status: status,
      last_connection: status === 'online' ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating device status:", error);
    throw error;
  }
};
