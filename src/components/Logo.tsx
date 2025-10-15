'use client';

import React from 'react';

interface LogoProps {
  size?: number; // px
}

export const Logo = ({ size = 32 }: LogoProps) => {
  const s = size;
  return (
    <div title="CanvaX" style={{ width: s, height: s }} className="flex items-center justify-center">
      <img src="/logo.svg" alt="CanvaX" style={{ width: s, height: s, objectFit: 'contain' }} />
    </div>
  );
};

export default Logo;
