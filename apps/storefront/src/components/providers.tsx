'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { SessionSync } from './session-sync';
export function Providers({children}: {children: React.ReactNode}) { const [client] = useState(() => new QueryClient({defaultOptions: {queries: {retry: 1, staleTime: 30000, refetchOnWindowFocus: false}}})); return <QueryClientProvider client={client}><MotionConfig reducedMotion="user">{children}<SessionSync/></MotionConfig></QueryClientProvider>; }

