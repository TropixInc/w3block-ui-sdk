import { lazy, ReactNode } from 'react';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
const Link = lazy(() =>
  import('../Link').then((module) => ({
    default: module.Link,
  }))
);

import { getButtonClassNames, OffpixButtonVariant } from '../PixwayButton';

interface Props {
  children?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  href: PixwayAppRoutes | string;
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
