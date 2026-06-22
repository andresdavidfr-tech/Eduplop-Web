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
        <linearGradient id="eduplopGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#4B3FE8" />
          <stop offset="50%" stopColor="#8B35F0" />
          <stop offset="100%" stopColor="#D020CE" />
        </linearGradient>
      </defs>

      {/* C arc opening to the right */}
      <path
        d="M 74 26 A 38 38 0 1 0 74 74"
        stroke="url(#eduplopGrad)"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      {/* Backpack handle */}
      <path
        d="M 43 37 C 43 30, 57 30, 57 37"
        stroke="#E8222E"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Backpack body */}
      <rect x="35" y="37" width="30" height="27" rx="5" fill="#E8222E" />

      {/* White smile */}
      <path d="M 40 50 Q 50 58 60 50" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
