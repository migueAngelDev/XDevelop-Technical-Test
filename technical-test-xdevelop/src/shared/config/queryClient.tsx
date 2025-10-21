"use client";

import { useState, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: PropsWithChildren) {
   const [client] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  retry: 1,
                  staleTime: 30_000,
                  refetchOnWindowFocus: false,
               },
               mutations: { retry: 1 },
            },
         })
   );

   return (
      <QueryClientProvider client={client}>
         {children}
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}
