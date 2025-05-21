
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchThresholdsByStationId, createThreshold, updateThreshold, deleteThreshold } from "@/services/thresholdService";
import { Threshold } from "@/types";

export function useThresholds(stationId?: string) {
  const queryClient = useQueryClient();
  
  const thresholdsQuery = useQuery({
    queryKey: ["thresholds", stationId],
    queryFn: () => stationId ? fetchThresholdsByStationId(stationId) : [],
    enabled: !!stationId
  });
  
  const createThresholdMutation = useMutation({
    mutationFn: (thresholdData: Partial<Threshold>) => createThreshold(thresholdData),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["thresholds", stationId] });
      }
    }
  });
  
  const updateThresholdMutation = useMutation({
    mutationFn: ({ id, thresholdData }: { id: string; thresholdData: Partial<Threshold> }) => 
      updateThreshold(id, thresholdData),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["thresholds", stationId] });
      }
    }
  });
  
  const deleteThresholdMutation = useMutation({
    mutationFn: (id: string) => deleteThreshold(id),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["thresholds", stationId] });
      }
    }
  });
  
  return {
    thresholdsQuery,
    createThresholdMutation,
    updateThresholdMutation,
    deleteThresholdMutation
  };
}
