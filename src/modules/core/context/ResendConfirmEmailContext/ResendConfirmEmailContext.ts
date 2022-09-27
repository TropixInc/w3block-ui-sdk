import { createContext } from 'react';

export type W3blockUISdkResendConfirmEmailProps = (cb: () => void) => void;

export const W3blockUISdkResendConfirmEmail =
  createContext<W3blockUISdkResendConfirmEmailProps | null>(null);
