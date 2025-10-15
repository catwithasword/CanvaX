"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useState } from 'react';
import { ClientErrorBoundary } from './components/ClientErrorBoundary';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ClientErrorBoundary>
          {children}
          <Toaster />
          <Sonner />
        </ClientErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
