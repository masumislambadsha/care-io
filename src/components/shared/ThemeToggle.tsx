"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/slices/themeSlice";
import { RootState } from "@/store";

export function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-1 rounded-lg cursor-pointer transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <span className="material-icons text-amber-400">light_mode</span>
      ) : (
        <span className="material-icons text-teal-600">dark_mode</span>
      )}
    </button>
  );
}
