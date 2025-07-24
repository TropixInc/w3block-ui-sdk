import { createContext } from 'react';

export type W3blockUISdkResendConfirmEmailProps = (cb: () => void) => void;

// Check if context already exists (for symlink development)
const globalKey = '__RESEND_CONFIRM_EMAIL_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<W3blockUISdkResendConfirmEmailProps | null>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<W3blockUISdkResendConfirmEmailProps | null>(null);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const W3blockUISdkResendConfirmEmail = context;
