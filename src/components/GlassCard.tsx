"use client";

import React from "react";

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`relative w-[200px] h-[250px] rounded-[14px] overflow-hidden flex flex-col items-center justify-center shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] ${className}`}
    >
      
      <div className="absolute top-[5px] left-[5px] w-[190px] h-[240px] z-[2] bg-white/95 backdrop-blur-[24px] rounded-[10px] overflow-hidden outline outline-2 outline-white" />

    
      <div className="absolute z-[1] top-1/2 left-1/2 w-[150px] h-[150px] rounded-full bg-red-500 opacity-100 blur-[12px] animate-blob-bounce" />

      
      {children && <div className="relative z-[3]">{children}</div>}
    </div>
  );
}
