import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const {
    redirectOnUnauthenticated: _redirectOnUnauthenticated = false,
    redirectPath: _redirectPath = "/login",
  } = options ?? {};

  const meQuery = trpc.clientAuth.getCurrentClient.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.clientAuth.logoutClient.useMutation({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignore errors on logout
    }
  }, [logoutMutation]);

  const state = useMemo(() => {
    return {
      user: meQuery.data?.user ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data?.user),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
