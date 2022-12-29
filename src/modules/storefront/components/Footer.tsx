import { CSSProperties } from 'react';

import { ReactComponent as DiscordIcon } from '../../shared/assets/icons/discord.svg';
import { ReactComponent as FacebookIcon } from '../../shared/assets/icons/facebook.svg';
import { ReactComponent as GlobeIcon } from '../../shared/assets/icons/globe.svg';
import { ReactComponent as InstagramIcon } from '../../shared/assets/icons/instagram.svg';
import { ReactComponent as LinkedinIcon } from '../../shared/assets/icons/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../../shared/assets/icons/message.svg';
import { ReactComponent as TwitterIcon } from '../../shared/assets/icons/twitter.svg';
import { ReactComponent as WhatsappIcon } from '../../shared/assets/icons/whatsapp.svg';
import { FooterData, FooterDefault, SocialNetworkType } from '../interfaces';

import './Footer.css';

type SVG = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

export const Footer = ({
  data,
  defaultData,
}: {
  data: FooterData;
  defaultData: FooterDefault;
}) => {
  const bgColor = data?.bgColor || defaultData.footerBgColor;
  const textColor = data?.textColor || defaultData.footerTextColor;
  const description = data?.description;
  const menuTextColor = data?.menuTextColor || defaultData.menuTextColor;
  const menuHoverColor = data?.menuHoverColor || defaultData.menuHoverColor;
  const menuLinks = data?.menuLinks;
  const socialNetworkIconColor =
    data?.socialNetworkIconColor || defaultData.socialNetworkIconColor;
  const socialNetworkIconHoverColor =
    data?.socialNetworkIconHoverColor ||
    defaultData.socialNetworkIconHoverColor;
  const socialNetworks = data?.socialNetworks;

  const iconsMap: Record<SocialNetworkType, SVG> = {
    twitter: TwitterIcon,
    telegram: TelegramIcon,
    discord: DiscordIcon,
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    linkedin: LinkedinIcon,
    whatsapp: WhatsappIcon,
    website: GlobeIcon,
  };

  return (
    <>
      <div
        style={{ backgroundColor: bgColor }}
        className="pw-w-full pw-font-poppins pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-items-center"
      >
        <div className="pw-flex pw-py-[22px] sm:pw-py-10 pw-flex-col pw-gap-[15px] sm:pw-gap-4 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full">
          <div className="pw-w-full pw-font-semibold pw-text-sm pw-leading-[17px] pw-gap-[7px] sm:pw-gap-[54px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row">
            {menuLinks?.map(({ label, value }) => (
              <a
                key={value}
                href={value}
                className="footer-menu"
                style={
                  {
                    textDecoration: 'none',
                    '--footer-menu-color': menuTextColor,
                    '--footer-menu-hover-color': menuHoverColor,
                  } as CSSProperties
                }
              >
                {label}
              </a>
            ))}
          </div>

          <div className="pw-w-[304px] sm:pw-w-full pw-bg-[#090909] sm:pw-bg-[#E4E4E4] pw-h-[1px]" />

          <div
            style={{ color: textColor }}
            className="pw-flex pw-items-center pw-gap-1 pw-font-normal pw-text-sm pw-leading-[15px] pw-text-center sm:pw-mx-20 md:pw-mx-28"
          >
            <p className="pw-text-center">{description}</p>
          </div>
          <div className="pw-w-full pw-flex pw-flex-wrap pw-gap-4 pw-justify-center">
            {socialNetworks?.map(({ type, url }) => {
              const Icon = iconsMap[type];

              return (
                <a
                  key={type}
                  href={url}
                  target="_blank"
                  className="pw-rounded-full pw-grid pw-place-items-center pw-p-2 footer-social-network"
                  style={
                    {
                      '--footer-social-network-color': socialNetworkIconColor,
                      '--footer-social-network-hover-color':
                        socialNetworkIconHoverColor,
                    } as CSSProperties
                  }
                  rel="noreferrer"
                >
                  <Icon className="pw-fill-white pw-w-4 pw-h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
