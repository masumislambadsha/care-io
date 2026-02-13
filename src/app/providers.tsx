"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";
import { store } from "@/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
              },
              success: {
                iconTheme: {
                  primary: "#0d9488",
                  secondary: "#fff",
                },
              },
            }}
          />
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
