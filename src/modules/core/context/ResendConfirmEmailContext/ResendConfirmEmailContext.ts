import { createContext } from 'react';

export type W3blockUISdkResendConfirmEmailProps = {
  openModal: boolean;
  minutesResendEmail: number;
  setOpenModal: () => void;
};

export const W3blockUISdkResendConfirmEmail = createContext(
  {} as W3blockUISdkResendConfirmEmailProps
);
