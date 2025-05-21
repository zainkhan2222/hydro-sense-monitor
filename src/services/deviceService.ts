
import { supabase } from "@/integrations/supabase/client";
import { Device, DeviceStatus } from "@/types";

export const fetchDevicesByStation = async (stationId: string): Promise<Device[]> => {
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
    type: device.type,
    stationId: device.station_id,
    status: device.status,
    lastConnection: device.last_connection,
    firmwareVersion: device.firmware_version,
    supportedParameters: device.supported_parameters,
    createdAt: device.created_at,
    updatedAt: device.updated_at
  }));
};

export const createDevice = async (deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">): Promise<Device> => {
  const { data, error } = await supabase
    .from("devices")
    .insert({
      name: deviceData.name,
      type: deviceData.type,
      station_id: deviceData.stationId,
      status: deviceData.status,
      last_connection: deviceData.lastConnection,
      firmware_version: deviceData.firmwareVersion,
      supported_parameters: deviceData.supportedParameters
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
    type: data.type,
    stationId: data.station_id,
    status: data.status,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version,
    supportedParameters: data.supported_parameters,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateDevice = async (id: string, deviceData: Partial<Device>): Promise<Device> => {
  const updateData: Record<string, any> = {};
  
  if (deviceData.name !== undefined) updateData.name = deviceData.name;
  if (deviceData.type !== undefined) updateData.type = deviceData.type;
  if (deviceData.stationId !== undefined) updateData.station_id = deviceData.stationId;
  if (deviceData.status !== undefined) updateData.status = deviceData.status;
  if (deviceData.lastConnection !== undefined) updateData.last_connection = deviceData.lastConnection;
  if (deviceData.firmwareVersion !== undefined) updateData.firmware_version = deviceData.firmwareVersion;
  if (deviceData.supportedParameters !== undefined) updateData.supported_parameters = deviceData.supportedParameters;

  const { data, error } = await supabase
    .from("devices")
    .update(updateData)
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
    type: data.type,
    stationId: data.station_id,
    status: data.status,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version,
    supportedParameters: data.supported_parameters,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Alias for updateDevice specifically for status updates
export const updateDeviceStatus = async (id: string, status: DeviceStatus): Promise<Device> => {
  return updateDevice(id, { status });
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
