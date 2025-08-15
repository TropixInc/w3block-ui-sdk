'use client';

export const useGetMobileOS = () => {
  if (typeof window !== 'undefined' && window.navigator) {
    const ua = window.navigator.userAgent;
    if (/android/i.test(ua)) {
      return 'Android';
    } else if (/iPad|iPhone|iPod|Mac/.test(ua)) {
      return 'iOS';
    }
    return 'Other';
  }
  return 'Other';
};
