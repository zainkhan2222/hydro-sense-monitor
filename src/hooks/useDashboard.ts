
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "@/services/dashboardService";

export function useDashboard() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardSummary,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  return {
    dashboardQuery
  };
}
