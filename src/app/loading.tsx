"use client";

import React from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-primary" aria-hidden="true"></div>
        <p className="text-lg font-medium text-gray-700">Loading…</p>
        <p className="text-sm text-gray-500">This may take a few seconds</p>
      </div>
    </div>
  );
}
