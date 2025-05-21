
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAlerts, fetchAlertsByStationId, acknowledgeAlert, getUnacknowledgedAlertsCount } from "@/services/alertService";

export function useAlerts(stationId?: string) {
  const queryClient = useQueryClient();
  
  const alertsQuery = useQuery({
    queryKey: ["alerts", stationId],
    queryFn: () => stationId ? fetchAlertsByStationId(stationId) : fetchAlerts()
  });
  
  const unacknowledgedCountQuery = useQuery({
    queryKey: ["alerts", "unacknowledged", "count"],
    queryFn: getUnacknowledgedAlertsCount
  });
  
  const acknowledgeAlertMutation = useMutation({
    mutationFn: ({ alertId, userId }: { alertId: string; userId: string }) => 
      acknowledgeAlert(alertId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alerts", "unacknowledged", "count"] });
    }
  });
  
  return {
    alertsQuery,
    unacknowledgedCountQuery,
    acknowledgeAlertMutation
  };
}
