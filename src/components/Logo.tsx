'use client';

import Image from 'next/image';
import React from 'react';

interface LogoProps {
  size?: number; // px
}

export const Logo = ({ size = 32 }: LogoProps) => {
  const s = size;
  return (
    <div title="CanvaX" style={{ width: s, height: s }} className="flex items-center justify-center">
      <Image
        src="/logo.svg"
        alt="CanvaX"
        width={s}
        height={s}
        style={{ width: s, height: s, objectFit: 'contain' }}
        priority
      />
    </div>
  );
};

export default Logo;
