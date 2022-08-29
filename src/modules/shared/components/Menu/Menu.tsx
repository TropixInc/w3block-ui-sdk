import { ReactNode, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import classNames from 'classnames';

import { ReactComponent as CopyIcon } from '../../assets/icons/copyIconOutlined.svg';
import { ReactComponent as CardIcon } from '../../assets/icons/creditCardOutlined.svg';
import { ReactComponent as HelpIcon } from '../../assets/icons/helpCircleOutlined.svg';
import { ReactComponent as ImageIcon } from '../../assets/icons/imageOutlined.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logoutOutlined.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settingsOutlined.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/userOutlined.svg';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useProfile } from '../../hooks';
import { Link } from '../Link';

interface MenuProps {
  tabs?: TabsProps[];
  className?: string;
}

interface TabsProps {
  title: string;
  icon: ReactNode;
  link: string;
}

const Tabs: TabsProps[] = [
  {
    title: 'Meu Perfil',
    icon: <UserIcon width={17} height={17} />,
    link: PixwayAppRoutes.PROFILE,
  },
  {
    title: 'Meus Tokens',
    icon: <ImageIcon width={17} height={17} />,
    link: PixwayAppRoutes.MY_TOKENS,
  },
  {
    title: 'Carteira',
    icon: <CardIcon width={17} height={17} />,
    link: PixwayAppRoutes.WALLET,
  },
  {
    title: 'Configurações',
    icon: <SettingsIcon width={17} height={17} />,
    link: PixwayAppRoutes.SETTINGS,
  },
  {
    title: 'Central de Ajuda',
    icon: <HelpIcon width={17} height={17} />,
    link: PixwayAppRoutes.HELP,
  },
  {
    title: 'Logout',
    icon: <LogoutIcon width={17} height={17} />,
    link: '',
  },
];

export const Menu = ({ tabs = Tabs, className }: MenuProps) => {
  const { data: profile } = useProfile();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const createdAt = new Date(profile?.data.createdAt as string);
  const day = createdAt.getDate();
  const month = createdAt.getMonth() + 1;
  const year = createdAt.getFullYear();
  const formatedDate = `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;

  const handleCopy = () => {
    copyToClipboard(profile?.data.mainWalletId as string);
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div
      className={classNames(
        'pw-flex pw-flex-col pw-justify-between pw-bg-white pw-py-7 pw-px-[23px] pw-w-[295px] pw-max-h-[595px] pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014]',
        className
      )}
    >
      <div>
        <p className="pw-text-center pw-font-poppins pw-text-2xl pw-font-semibold pw-text-[#35394C] pw-mx-auto pw-mb-2">
          {profile?.data.name}
        </p>
        <div className="pw-flex pw-items-center pw-justify-center pw-mb-10">
          <p className="pw-font-poppins pw-text-sm pw-font-semibold pw-text-[#777E8F] pw-mr-2 pw-mt-[1px]">
            {profile?.data.mainWalletId.substring(0, 8)}
            {'...'}
            {profile?.data.mainWalletId.substring(
              profile?.data.mainWalletId.length - 6,
              profile?.data.mainWalletId.length
            )}
          </p>
          <button onClick={handleCopy}>
            <CopyIcon width={17} height={17} />
          </button>
          {isCopied && (
            <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
              Copied!
            </span>
          )}
        </div>
        <ul className="pw-mx-auto pw-w-[248px]">
          {tabs.map((tabs) => (
            <Link href={tabs.link} key={tabs.title}>
              <li
                key={tabs.title}
                className="pw-flex pw-items-center pw-justify-start pw-h-[47px] pw-rounded-[4px] hover:pw-bg-[#EFEFEF] active:pw-bg-[#4194CD4D] active:pw-bg-opacity-[0.4] pw-text-[#35394C] active:!pw-text-[#295BA6] pw-pl-3 pw-stroke-[#383857] active:pw-stroke-[#295BA6]"
              >
                {tabs.icon}
                <p className="pw-font-poppins pw-text-lg pw-font-medium pw-ml-5">
                  {tabs.title}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <p className="pw-font-nunito pw-text-sm pw-font-normal pw-text-[#35394C] pw-opacity-[0.5] pw-mt-15 pw-mx-auto">
        Membro desde {formatedDate}
      </p>
    </div>
  );
};
