import { MouseEventHandler, ReactNode } from 'react';

import { useRouterConnect } from '../../hooks/useRouterConnect';

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  disabled?: boolean;
}

export const Link = ({
  children,
  href,
  className = '',
  disabled = false,
}: LinkProps) => {
  const router = useRouterConnect();
  const onClickLink: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    router.push(href);
  };

  return disabled ? (
    <div className={className}>{children}</div>
  ) : (
    <a
      aria-disabled={disabled}
      href={href}
      onClick={onClickLink}
      className={className}
    >
      {children}
    </a>
  );
};
