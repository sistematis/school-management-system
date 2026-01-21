/**
 * Query Client Provider
 *
 * Provides TanStack Query (React Query) client to the app
 */

"use client";

import { type ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

/**
 * Get or create a singleton QueryClient for client-side
 */
function getQueryClient(): QueryClient {
  if (browserQueryClient) return browserQueryClient;

  browserQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });

  return browserQueryClient;
}

interface QueryClientProviderProps {
  children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}
