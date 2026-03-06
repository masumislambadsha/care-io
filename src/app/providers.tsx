"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/queryClient";
import { store } from "@/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="care-xyz-theme"
      >
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
