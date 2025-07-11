
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchReadings, 
  createReading, 
  fetchReadingsByDateRange
} from "@/services/readingService";
import { Reading } from "@/types";

export function useReadings(stationId?: string) {
  const queryClient = useQueryClient();
  
  const readingsQuery = useQuery({
    queryKey: ["readings", stationId],
    queryFn: () => stationId ? fetchReadings(stationId) : [],
    enabled: !!stationId
  });
  
  const createReadingMutation = useMutation({
    mutationFn: (readingData: Omit<Reading, "id" | "createdAt">) => createReading(readingData),
    onSuccess: () => {
      if (stationId) {
        queryClient.invalidateQueries({ queryKey: ["readings", stationId] });
        queryClient.invalidateQueries({ queryKey: ["station", stationId] });
      }
    }
  });
  
  return {
    readingsQuery,
    createReadingMutation,
    useReadingsByDateRange: (startDate: Date, endDate: Date) => {
      return useQuery({
        queryKey: ["readings", "dateRange", stationId, startDate, endDate],
        queryFn: () => stationId ? fetchReadingsByDateRange(stationId, startDate, endDate) : [],
        enabled: !!stationId
      });
    }
  };
}
