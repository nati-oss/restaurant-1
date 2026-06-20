import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export function useStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 60_000,
  });
}
