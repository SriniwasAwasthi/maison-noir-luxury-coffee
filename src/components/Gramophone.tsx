import React from 'react';
import { motion } from 'framer-motion';

interface GramophoneProps {
  isPlaying: boolean;
  size?: number;
  className?: string;
}

export default function Gramophone({ isPlaying, size = 32, className = '' }: GramophoneProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(201,162,94,0.5)]"
      >
        <defs>
          <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4dfa8" />
            <stop offset="40%" stopColor="#c9a25e" />
            <stop offset="75%" stopColor="#e8c98a" />
            <stop offset="100%" stopColor="#9a7434" />
          </linearGradient>

          <linearGradient id="hornShine" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#faecd0" />
            <stop offset="50%" stopColor="#c9a25e" />
            <stop offset="100%" stopColor="#6a4a1c" />
          </linearGradient>

          <radialGradient id="vinylCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a25e" />
            <stop offset="50%" stopColor="#0d0a07" />
            <stop offset="90%" stopColor="#1e1610" />
            <stop offset="100%" stopColor="#c9a25e" />
          </radialGradient>
        </defs>

        {/* Vintage Gramophone Wooden Base */}
        <path
          d="M 12 48 L 52 48 L 48 58 L 16 58 Z"
          fill="#1e1610"
          stroke="url(#brassGold)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Base Trim Line */}
        <line x1="15" y1="53" x2="49" y2="53" stroke="url(#brassGold)" strokeWidth="1" strokeOpacity="0.7" />

        {/* Antique Fluted Horn (Trumpet) */}
        <path
          d="M 28 42 C 28 34, 38 28, 44 20 C 47 16, 52 8, 56 6 C 54 16, 50 24, 40 30 C 35 34, 32 38, 30 42 Z"
          fill="url(#hornShine)"
          stroke="url(#brassGold)"
          strokeWidth="1"
        />
        {/* Fluted Horn Bell Flare */}
        <ellipse
          cx="54"
          cy="9"
          rx="7"
          ry="5"
          transform="rotate(-25 54 9)"
          fill="url(#brassGold)"
          stroke="#faecd0"
          strokeWidth="1"
        />

        {/* Tone Arm and Needle */}
        <path
          d="M 42 46 C 42 42, 38 40, 32 40 L 26 42"
          stroke="url(#brassGold)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="26" cy="42" r="1.5" fill="#faf5ea" />

        {/* Rotating Gramophone Vinyl Record Disc (Continuous Clockwise Rotation) */}
        <g
          style={{
            transformOrigin: '26px 42px',
            animation: isPlaying ? 'spin 3s linear infinite' : 'none',
          }}
        >
          {/* Vinyl Outer Edge */}
          <circle
            cx="26"
            cy="42"
            r="16"
            fill="#120e0a"
            stroke="url(#brassGold)"
            strokeWidth="1.2"
          />

          {/* Micro Grooves */}
          <circle cx="26" cy="42" r="13" stroke="#c9a25e" strokeOpacity="0.25" strokeWidth="0.7" strokeDasharray="3 1" />
          <circle cx="26" cy="42" r="10" stroke="#c9a25e" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="4 1.5" />
          <circle cx="26" cy="42" r="7" stroke="#c9a25e" strokeOpacity="0.25" strokeWidth="0.7" />

          {/* Vintage Center Label */}
          <circle cx="26" cy="42" r="4.5" fill="url(#brassGold)" />
          <circle cx="26" cy="42" r="1.2" fill="#0d0a07" />

          {/* Vinyl Reflection Shimmer */}
          <path
            d="M 12 42 A 14 14 0 0 1 26 28 L 26 34 A 8 8 0 0 0 18 42 Z"
            fill="url(#brassGold)"
            opacity="0.3"
          />
          <path
            d="M 40 42 A 14 14 0 0 1 26 56 L 26 50 A 8 8 0 0 0 34 42 Z"
            fill="url(#brassGold)"
            opacity="0.3"
          />
        </g>
      </svg>
    </div>
  );
}
