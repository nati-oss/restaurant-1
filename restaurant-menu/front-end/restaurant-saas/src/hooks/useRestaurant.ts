import { useQuery } from '@tanstack/react-query';
import { restaurantApi } from '@/services/api';

export function useRestaurant(slug: string) {
  return useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenu(slug: string) {
  return useQuery({
    queryKey: ['menu', slug],
    queryFn: () => restaurantApi.getMenu(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
}
