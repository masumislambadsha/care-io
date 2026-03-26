"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { initializeTheme } from "@/store/slices/themeSlice";

export function ThemeInitializer() {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(initializeTheme());
  }, [dispatch]);

  
  if (!mounted) {
    return null;
  }

  return null;
}
