import { ReactNode } from 'react';
import { useHasWallet } from '../hooks/useHasWallet';

interface InternalPageHeaderWithFundsProps {
  title?: string;
  children?: ReactNode;
}

export const InternalpageHeaderWithFunds = ({
  title = 'Carteira',
  children,
}: InternalPageHeaderWithFundsProps) => {
  useHasWallet({});

  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
      <div className="pw-w-full pw-items-center  sm:pw-flex">
        <div>
          <span className="pw-font-semibold pw-text-lg pw-flex pw-items-baseline sm:pw-text-[23px] pw-leading-[32px]">
            {title}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};
