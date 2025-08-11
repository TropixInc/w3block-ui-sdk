'use client';

import * as React from 'react';

declare global {
  interface Window {
    [key: string]: any;
  }
}

export function createSymlinkSafeContext<T>(
  globalKey: string,
  defaultValue: T
): React.Context<T> {
  let context: React.Context<T>;

  if (typeof window !== 'undefined' && window[globalKey]) {
    context = window[globalKey];
  } else {
    context = React.createContext<T>(defaultValue);
    if (typeof window !== 'undefined') {
      window[globalKey] = context;
    }
  }

  return context;
}