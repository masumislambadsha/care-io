"use client";

import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";

    
    const style = document.createElement("style");
    style.id = "auth-light-mode";
    style.textContent = `
      input, textarea, select {
        color: #0f172a !important;
        -webkit-text-fill-color: #0f172a !important;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-text-fill-color: #0f172a !important;
        -webkit-box-shadow: 0 0 0px 1000px #f8fafc inset !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      
      document.documentElement.style.colorScheme = "";
      const styleEl = document.getElementById("auth-light-mode");
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  return <div className="light">{children}</div>;
}
