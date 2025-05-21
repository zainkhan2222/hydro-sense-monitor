
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReadingsByStationId, createReading, fetchReadingsForAnalysis } from "@/services/readingService";
import { Reading } from "@/types";

export function useReadings(stationId?: string) {
  const queryClient = useQueryClient();
  
  const readingsQuery = useQuery({
    queryKey: ["readings", stationId],
    queryFn: () => stationId ? fetchReadingsByStationId(stationId) : [],
    enabled: !!stationId
  });
  
  const createReadingMutation = useMutation({
    mutationFn: (readingData: Partial<Reading>) => createReading(readingData),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["readings", stationId] });
        queryClient.invalidateQueries({ queryKey: ["station", stationId] });
      }
    }
  });
  
  const useReadingAnalysis = (parameter: string, startDate: Date, endDate: Date) => {
    return useQuery({
      queryKey: ["readings", "analysis", stationId, parameter, startDate, endDate],
      queryFn: () => stationId ? fetchReadingsForAnalysis(stationId, parameter, startDate, endDate) : [],
      enabled: !!stationId
    });
  };
  
  return {
    readingsQuery,
    createReadingMutation,
    useReadingAnalysis
  };
}
