import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: admin, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin && !error,
    error,
  };
}