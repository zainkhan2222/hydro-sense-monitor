
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchDevicesByStation, 
  createDevice, 
  updateDevice, 
  deleteDevice,
  updateDeviceStatus
} from "@/services/deviceService";
import { Device, DeviceStatus } from "@/types";

export function useDevices(stationId?: string) {
  const queryClient = useQueryClient();
  
  const devicesQuery = useQuery({
    queryKey: ["devices", stationId],
    queryFn: () => stationId ? fetchDevicesByStation(stationId) : [],
    enabled: !!stationId
  });
  
  const createDeviceMutation = useMutation({
    mutationFn: (deviceData: Omit<Device, "id" | "createdAt" | "updatedAt">) => 
      createDevice(deviceData),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["devices", stationId] });
        queryClient.invalidateQueries({ queryKey: ["station", stationId] });
      }
    }
  });
  
  const updateDeviceMutation = useMutation({
    mutationFn: ({ id, deviceData }: { id: string; deviceData: Partial<Device> }) => 
      updateDevice(id, deviceData),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["devices", stationId] });
        queryClient.invalidateQueries({ queryKey: ["station", stationId] });
      }
    }
  });
  
  const deleteDeviceMutation = useMutation({
    mutationFn: (id: string) => deleteDevice(id),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["devices", stationId] });
        queryClient.invalidateQueries({ queryKey: ["station", stationId] });
      }
    }
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DeviceStatus }) => 
      updateDeviceStatus(id, status),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["devices", stationId] });
        queryClient.invalidateQueries({ queryKey: ["station", stationId] });
      }
    }
  });
  
  return {
    devicesQuery,
    createDeviceMutation,
    updateDeviceMutation,
    deleteDeviceMutation,
    updateStatusMutation
  };
}
