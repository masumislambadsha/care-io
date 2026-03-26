
"use client";

import React from "react";

type MovingBorderCardProps = {
  children: React.ReactNode;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
};

const MovingBorderCard: React.FC<MovingBorderCardProps> = ({
  children,
  borderColor = "#06b6d4",
  borderWidth = 3,
  radius = 18,
}) => {
  return (
    <div className="relative">
      
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
        style={{ borderRadius: radius }}
      >
        
        <div
          className="
            absolute inset-[-50%]
            bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,rgba(6,182,212,1)_180deg,transparent_240deg,transparent_360deg)]
            animate-spin-slow
          "
          style={{}}
        />
      </div>

      
      <div
        className="relative bg-white rounded-2xl"
        style={{
          borderRadius: radius,
          padding: borderWidth,
        }}
      >
        <div
          className="bg-white rounded-2xl h-full w-full"
          style={{ borderRadius: radius - borderWidth }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MovingBorderCard;
