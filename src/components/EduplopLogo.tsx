import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function EduplopLogo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        {/* The beautiful bright blue, purple, and magenta gradient of the outer C-shape loop based on the uploaded logo */}
        <linearGradient id="eduplopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B26F2" /> {/* Electric blue/violet */}
          <stop offset="50%" stopColor="#8A3CF2" /> {/* Vibrant royal purple */}
          <stop offset="100%" stopColor="#D926EC" /> {/* Radiant magenta/pink */}
        </linearGradient>
      </defs>

      {/* Styled outer C/G loop circular shape */}
      <path
        d="M 78 32 A 38 38 0 1 0 78 68"
        stroke="url(#eduplopGrad)"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />

      {/* 1. School Backpack Handle on Top */}
      <path
        d="M 44 38 C 44 31, 56 31, 56 38"
        stroke="#EF4444"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. Side flaps/attachment wings */}
      <rect x="32" y="57" width="3" height="6.5" rx="1.2" fill="#EF4444" />
      <rect x="65" y="57" width="3" height="6.5" rx="1.2" fill="#EF4444" />

      {/* 3. Main School Backpack Body (Rounded shoulders and base) */}
      <path
        d="M 35 61 L 35 47 C 35 41, 40 38, 46 38 L 54 38 C 60 38, 65 41, 65 47 L 65 61 C 65 63.8, 63.2 65, 60.5 65 L 39.5 65 C 36.8 65, 35 63.8, 35 61 Z"
        fill="#EF4444"
      />

      {/* 4. White Front Zipper Pocket Contour */}
      <path
        d="M 39 65 L 39 52 C 39 49.5, 41.5 48.2, 45 48.2 L 55 48.2 C 58.5 48.2, 61 49.5, 61 52 L 61 65"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
