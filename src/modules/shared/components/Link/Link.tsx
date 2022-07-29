import React, { MouseEventHandler, ReactNode } from 'react';

import useRouter from '../../hooks/useRouter';

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export const Link = ({ children, href, className = '' }: LinkProps) => {
  const router = useRouter();
  const onClickLink: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={onClickLink} className={className}>
      {children}
    </a>
  );
};
