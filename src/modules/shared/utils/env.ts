export const getEnvVar = (key: string, fallback = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  
  if (typeof window !== 'undefined') {
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.env?.[key]) {
      return nextData.env[key];
    }
  }
  
  return fallback;
};

export const isServer = () => typeof window === 'undefined';
export const isClient = () => typeof window !== 'undefined';