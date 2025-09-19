import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a singleton QueryClient with sensible defaults
let queryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 min
          refetchOnWindowFocus: false,
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return queryClient;
};

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = getQueryClient();
  return React.createElement(
    QueryClientProvider,
    { client },
    children as React.ReactNode
  );
};
