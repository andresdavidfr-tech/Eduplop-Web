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
        {/* The beautiful blue, purple, and magenta gradient of the outer C-shape loop */}
        <linearGradient id="eduplopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" /> {/* Indigo-600 */}
          <stop offset="50%" stopColor="#4F46E5" /> {/* Indigo-500 */}
          <stop offset="70%" stopColor="#7C3AED" /> {/* Purple-600 */}
          <stop offset="100%" stopColor="#DB2777" /> {/* Pink-600 */}
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

      {/* Inner red padlock */}
      {/* Padlock Body */}
      <rect
        x="36"
        y="46"
        width="28"
        height="22"
        rx="6"
        fill="#EF4444" 
      />
      
      {/* Padlock Shackle */}
      <path
        d="M 42 46 V 39 A 8 8 0 0 1 58 39 V 46"
        stroke="#EF4444"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Padlock white keyhole slit detail (as seen in screenshots) */}
      <rect
        x="45"
        y="53"
        width="10"
        height="8"
        rx="2"
        fill="white"
      />
      <rect
        x="48"
        y="50"
        width="4"
        height="6"
        rx="1"
        fill="white"
      />
    </svg>
  );
}
