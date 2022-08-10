import { ReactChild } from 'react';

import { ReactComponent as CopyIcon } from '../../../../shared/assets/icons/copy.svg';
import { ReactComponent as EditIcon } from '../../../../shared/assets/icons/pencil.svg';

interface MenuItem {
  item: ReactChild;
  onClick(): void;
}

interface Classes {
  container: string;
  title: string;
  walletAddress: string;
  menuItem: string;
  footer: string;
}

export interface MenuProps {
  classes?: Classes;
  title: string;
  walletAddress: string;
  items: MenuItem[];
  footer: ReactChild;
}

export const Menu = ({
  classes,
  title,
  walletAddress,
  items,
  footer,
}: MenuProps) => {
  return (
    <div
      className={`pw-max-w-[295px] pw-w-full pw-bg-white pw-py-7 pw-px-[23px] pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] ${classes?.container}`}
    >
      <div className="pw-flex pw-items-center pw-justify-center">
        <p
          className={`pw-text-center pw-text-[#35394C] pw-font-bold pw-text-[24px] pw-mb-4 pw-mr-2 ${classes?.title}`}
        >
          {title}
        </p>
        <EditIcon />
      </div>
      <div className="pw-flex pw-items-center pw-justify-center">
        <p
          className={`pw-text-center pw-text-[#777E8F] pw-font-semibold pw-text-[14px] pw-mb-6 pw-mr-2 ${classes?.walletAddress}`}
        >
          {walletAddress}
        </p>
        <CopyIcon />
      </div>
      {items.map((item, index) => (
        <div key={index} onClick={item.onClick} className={classes?.menuItem}>
          {item.item}
        </div>
      ))}
      {footer}
    </div>
  );
};
