import { JSX, ReactNode } from 'react';

import { useCompanyConfig } from '../../hooks/useCompanyConfig';

interface ContainerCenterProps {
  infoComponent: ReactNode | JSX.Element;
  className?: string;
  logoUrl?: string;
}

export const ContainerCenter = ({
  infoComponent,
  className = '',
  logoUrl,
}: ContainerCenterProps) => {
  const { logoUrl: logoDefault } = useCompanyConfig();
  return (
    <div
      className={`pw-flex pw-flex-col pw-items-center pw-justify-center pw-w-full  ${className}`}
    >
      <a href="/">
        <img
          className="pw-max-w-[150px] pw-max-h-[50px] pw-object-contain pw-mb-[60px]"
          src={logoUrl ? logoUrl : logoDefault}
          alt="Logo"
        />
      </a>
      {infoComponent}
    </div>
  );
};
