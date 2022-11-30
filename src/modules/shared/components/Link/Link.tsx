import { MouseEventHandler, ReactNode } from 'react';

import { useRouterConnect } from '../../hooks/useRouterConnect';

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  disabled?: boolean;
  itemProp?: string;
}

export const Link = ({
  children,
  href,
  className = '',
  disabled = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemProp = '',
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
