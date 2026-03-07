"use client";

import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Force light mode on auth pages
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";

    return () => {
      // Restore color scheme on unmount
      document.documentElement.style.colorScheme = "";
    };
  }, []);

  return <div className="light">{children}</div>;
}
