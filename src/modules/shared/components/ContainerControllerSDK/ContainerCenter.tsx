import { ReactNode } from 'react';

interface ContainerCenterProps {
  infoComponent: ReactNode | JSX.Element;
  className?: string;
}

export const ContainerCenter = ({
  infoComponent,
  className = '',
}: ContainerCenterProps) => {
  return (
    <div className={`pw-flex pw-justify-center pw-w-full ${className}`}>
      {infoComponent}
    </div>
  );
};
