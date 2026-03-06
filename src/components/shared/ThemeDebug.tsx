"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDebug() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const [htmlClass, setHtmlClass] = useState("");

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setHtmlClass(document.documentElement.className);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 border-2 border-teal-600 rounded-lg p-4 shadow-xl text-xs max-w-xs z-50">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">
        Theme Debug
      </h3>
      <div className="space-y-1 text-slate-700 dark:text-slate-300">
        <p>
          <strong>Theme:</strong> {theme}
        </p>
        <p>
          <strong>System:</strong> {systemTheme}
        </p>
        <p>
          <strong>Resolved:</strong> {resolvedTheme}
        </p>
        <p>
          <strong>HTML class:</strong>{" "}
          <code className="bg-slate-100 dark:bg-slate-900 px-1 rounded">
            {htmlClass || "(none)"}
          </code>
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setTheme("light")}
          className="px-2 py-1 bg-amber-400 text-slate-900 rounded text-xs font-semibold"
        >
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className="px-2 py-1 bg-slate-800 text-white rounded text-xs font-semibold"
        >
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-semibold"
        >
          System
        </button>
      </div>
    </div>
  );
}
