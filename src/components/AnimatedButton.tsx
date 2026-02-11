"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function AnimatedButton({
  href,
  children,
  variant = "primary",
  className = "",
}: AnimatedButtonProps) {
  const baseClasses =
    variant === "primary"
      ? "bg-teal-600 text-white hover:bg-teal-700"
      : "bg-white text-teal-600 border-2 border-teal-600 hover:bg-slate-50";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href={href}
        className={`${baseClasses} font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-center block relative overflow-hidden group ${className}`}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  );
}
