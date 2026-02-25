"use client";

import { WalletWithBalance } from '../../utils/checkoutHelpers';

interface LoyaltyBalanceDisplayProps {
  organizedLoyalties: WalletWithBalance[] | undefined;
  translate: (key: string) => string;
  className?: string;
  showCurrencyInLabel?: boolean;
  /** Se false, mostra apenas o valor numérico (para uso inline) */
  showLabel?: boolean;
}

export function LoyaltyBalanceDisplay({
  organizedLoyalties,
  translate,
  className = '',
  showCurrencyInLabel = false,
  showLabel = true,
}: LoyaltyBalanceDisplayProps) {
  const hasBalance =
    organizedLoyalties?.some(
      (w) =>
        w?.type === 'loyalty' &&
        w?.balance &&
        parseFloat(w?.balance ?? '0') > 0
    ) ?? false;

  const wallet = organizedLoyalties?.find(
    (w) =>
      w?.type === 'loyalty' &&
      w?.balance &&
      parseFloat(w?.balance ?? '0') > 0
  );

  const balance = wallet
    ? wallet.pointsPrecision === 'decimal'
      ? parseFloat(wallet.balance ?? '0').toFixed(2)
      : parseFloat(wallet.balance ?? '0').toFixed(0)
    : '0';

  const content = (
    <>
      {showLabel && (
        <>
          {translate('wallet>page>balance')}{' '}
          {showCurrencyInLabel && organizedLoyalties?.[0]?.currency
            ? `${organizedLoyalties[0].currency}: `
            : ''}
        </>
      )}
      {hasBalance ? balance : '0'}
    </>
  );

  return showLabel ? (
    <p
      className={`pw-text-sm pw-text-[#35394C] pw-font-[400] pw-mt-2 pw-font-poppins ${className}`}
    >
      {content}
    </p>
  ) : (
    <span className={className}>{content}</span>
  );
}
