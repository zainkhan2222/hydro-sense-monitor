
import { supabase } from "@/integrations/supabase/client";
import { Device, DeviceType, DeviceStatus, ParameterType } from "@/types";

export const fetchDevices = async (): Promise<Device[]> => {
  const { data, error } = await supabase
    .from("devices")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Device interface
  const devices: Device[] = data.map((device) => ({
    id: device.id,
    name: device.name,
    type: device.type as DeviceType,
    stationId: device.station_id,
    status: device.status as DeviceStatus,
    lastConnection: device.last_connection,
    firmwareVersion: device.firmware_version || "",
    supportedParameters: device.supported_parameters as ParameterType[],
    createdAt: device.created_at,
    updatedAt: device.updated_at
  }));

  return devices;
};

export const fetchDevicesByStation = async (stationId: string): Promise<Device[]> => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("station_id", stationId);

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Device interface
  const devices: Device[] = data.map((device) => ({
    id: device.id,
    name: device.name,
    type: device.type as DeviceType,
    stationId: device.station_id,
    status: device.status as DeviceStatus,
    lastConnection: device.last_connection,
    firmwareVersion: device.firmware_version || "",
    supportedParameters: device.supported_parameters as ParameterType[],
    createdAt: device.created_at,
    updatedAt: device.updated_at
  }));

  return devices;
};

export const fetchDevice = async (id: string): Promise<Device> => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Device interface
  const device: Device = {
    id: data.id,
    name: data.name,
    type: data.type as DeviceType,
    stationId: data.station_id,
    status: data.status as DeviceStatus,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version || "",
    supportedParameters: data.supported_parameters as ParameterType[],
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  return device;
};

export const createDevice = async (
  device: Omit<Device, "id" | "createdAt" | "updatedAt">
): Promise<Device> => {
  const { data, error } = await supabase
    .from("devices")
    .insert({
      name: device.name,
      type: device.type,
      station_id: device.stationId,
      status: device.status,
      firmware_version: device.firmwareVersion,
      supported_parameters: device.supportedParameters,
      last_connection: device.lastConnection,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Device interface
  return {
    id: data.id,
    name: data.name,
    type: data.type as DeviceType,
    stationId: data.station_id,
    status: data.status as DeviceStatus,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version || "",
    supportedParameters: data.supported_parameters as ParameterType[],
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateDevice = async (
  id: string,
  device: Partial<Device>
): Promise<Device> => {
  const updateData = {
    name: device.name,
    type: device.type,
    status: device.status,
    firmware_version: device.firmwareVersion,
    supported_parameters: device.supportedParameters,
    last_connection: device.lastConnection
  };

  const { data, error } = await supabase
    .from("devices")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Device interface
  return {
    id: data.id,
    name: data.name,
    type: data.type as DeviceType,
    stationId: data.station_id,
    status: data.status as DeviceStatus,
    lastConnection: data.last_connection,
    firmwareVersion: data.firmware_version || "",
    supportedParameters: data.supported_parameters as ParameterType[],
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
    throw new Error(error.message);
  }
};

// For compatibility with existing code, provide alias functions
export const fetchDevicesByStationId = fetchDevicesByStation;
export const updateDeviceStatus = (id: string, status: DeviceStatus): Promise<Device> => {
  return updateDevice(id, { status });
};
