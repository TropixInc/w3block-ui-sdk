import { ReactNode } from 'react';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { Link } from '../Link';
import { getButtonClassNames, OffpixButtonVariant } from '../PixwayButton';

interface Props {
  children?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  href: PixwayAppRoutes;
  variant?: OffpixButtonVariant;
}

export const PixwayLinkButton = ({
  href,
  children,
  fullWidth,
  className,
  variant,
}: Props) => {
  return (
    <Link
      href={href}
      className={getButtonClassNames({ className, fullWidth, variant })}
    >
      {children}
    </Link>
  );
};
