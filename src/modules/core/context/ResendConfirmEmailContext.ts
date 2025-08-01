import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

export type W3blockUISdkResendConfirmEmailProps = (cb: () => void) => void;

export const W3blockUISdkResendConfirmEmail = createSymlinkSafeContext<W3blockUISdkResendConfirmEmailProps | null>(
  '__RESEND_CONFIRM_EMAIL_CONTEXT__',
  null
);
