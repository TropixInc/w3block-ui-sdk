import { ReactNode } from 'react';

interface BalanceWalletAreaProps {
  children?: ReactNode;
  paddingX?: number;
}

export const BalanceWalletArea = ({
  children,
  paddingX = 30,
}: BalanceWalletAreaProps) => {
  return (
    <div
      style={{ padding: '14px ' + paddingX + 'px' }}
      className="pw-bg-[#EFEFEF] pw-border pw-border-[#DCDCDC] pw-rounded-full pw-flex pw-justify-center pw-items-center"
    >
      {children}
    </div>
  );
};
