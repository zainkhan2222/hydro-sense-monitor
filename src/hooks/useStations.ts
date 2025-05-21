
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStations, fetchStationById, createStation, updateStation, deleteStation, regenerateApiKey } from "@/services/stationService";
import { Station } from "@/types";

export function useStations() {
  const queryClient = useQueryClient();
  
  const stationsQuery = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations
  });
  
  const createStationMutation = useMutation({
    mutationFn: (stationData: Partial<Station>) => createStation(stationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    }
  });
  
  const updateStationMutation = useMutation({
    mutationFn: ({ id, stationData }: { id: string; stationData: Partial<Station> }) => 
      updateStation(id, stationData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      queryClient.invalidateQueries({ queryKey: ["station", variables.id] });
    }
  });
  
  const deleteStationMutation = useMutation({
    mutationFn: (id: string) => deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    }
  });
  
  const regenerateApiKeyMutation = useMutation({
    mutationFn: (id: string) => regenerateApiKey(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["station", id] });
    }
  });
  
  return {
    stationsQuery,
    createStationMutation,
    updateStationMutation,
    deleteStationMutation,
    regenerateApiKeyMutation,
    
    // Additional utility function to get a single station
    useStation: (id?: string) => {
      return useQuery({
        queryKey: ["station", id],
        queryFn: () => id ? fetchStationById(id) : null,
        enabled: !!id // Only run the query if we have an id
      });
    }
  };
}
