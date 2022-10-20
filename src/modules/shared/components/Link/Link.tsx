import { MouseEventHandler, ReactNode } from 'react';

import useRouter from '../../hooks/useRouter';

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  itemProp?: string;
}

export const Link = ({
  children,
  href,
  className = '',
  itemProp = '',
}: LinkProps) => {
  const router = useRouter();
  const onClickLink: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <a
      href={href}
      onClick={onClickLink}
      itemProp={itemProp}
      className={className}
    >
      {children}
    </a>
  );
};
