import { CSSProperties } from 'react';

import { ReactComponent as DiscordIcon } from '../../shared/assets/icons/discord.svg';
import { ReactComponent as FacebookIcon } from '../../shared/assets/icons/facebook.svg';
import { ReactComponent as GlobeIcon } from '../../shared/assets/icons/globe.svg';
import { ReactComponent as InstagramIcon } from '../../shared/assets/icons/instagram.svg';
import { ReactComponent as LinkedinIcon } from '../../shared/assets/icons/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../../shared/assets/icons/message.svg';
import { ReactComponent as TwitterIcon } from '../../shared/assets/icons/twitter.svg';
import { ReactComponent as WhatsappIcon } from '../../shared/assets/icons/whatsapp.svg';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useMergeMobileData } from '../hooks/useMergeMobileData/useMergeMobileData';
import { FooterData } from '../interfaces';

import './Footer.css';

type SVG = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

export const Footer = ({ data }: { data: FooterData }) => {
  const { styleData, contentData, mobileStyleData, mobileContentData } = data;

  const mergedStyleData = useMergeMobileData(styleData, mobileStyleData);
  const mergedContentData =
    useMergeMobileData(contentData, mobileContentData) || {};

  const {
    backgroundColor,
    textColor,
    menuLinks,
    menuLinksColor,
    menuLinksHoverColor,
    socialNetworksIconColor,
    socialNetworksIconHoverColor,
    socialNetworks,
    w3blockSignature,
    margin,
    padding,
  } = mergedStyleData;

  const { description } = mergedContentData;

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

  const names: (keyof FooterData['contentData'])[] = [
    'twitter',
    'telegram',
    'discord',
    'instagram',
    'facebook',
    'linkedin',
    'whatsapp',
    'website',
  ];

  const socialLinks = names.map((name) => ({
    url: mergedContentData?.[name],
    type: name as SocialNetworkType,
  }));

  return (
    <div
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div
        style={{ backgroundColor }}
        className="pw-w-full pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-items-center"
      >
        <div className="pw-pb-6 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full pw-pt-10">
          <div className="pw-w-full pw-font-semibold pw-text-sm pw-gap-2 sm:pw-gap-[26px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row">
            {menuLinks?.map(({ name, slug }) => (
              <a
                key={slug}
                href={slug}
                className="footer-menu"
                style={
                  {
                    textDecoration: 'none',
                    '--footer-menu-color': menuLinksColor,
                    '--footer-menu-hover-color': menuLinksHoverColor,
                  } as CSSProperties
                }
              >
                {name}
              </a>
            ))}
          </div>

          <div className="pw-w-full pw-bg-[#ffffffaa] pw-h-[1px] pw-my-[10px]" />

          <div
            style={{ color: textColor }}
            className="pw-text-sm pw-leading-5 pw-text-center pw-px-7 sm:pw-px-28"
          >
            <p className="pw-text-center">{description}</p>
          </div>

          {socialNetworks && (
            <div className="pw-w-full pw-flex pw-flex-wrap pw-gap-2 pw-justify-center pw-pt-4">
              {socialLinks.map((socialLink) => {
                if (!socialLink.url || socialLink.url == '') return null;

                const Icon = iconsMap[socialLink.type];

                return (
                  <a
                    key={socialLink.type}
                    href={socialLink.url}
                    target="_blank"
                    className="pw-rounded-full pw-grid pw-place-items-center pw-p-2 footer-social-network"
                    style={
                      {
                        '--footer-social-network-color':
                          socialNetworksIconColor,
                        '--footer-social-network-hover-color':
                          socialNetworksIconHoverColor,
                      } as CSSProperties
                    }
                    rel="noreferrer"
                  >
                    <Icon className="pw-fill-white pw-w-4 pw-h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {w3blockSignature && (
        <div className="pw-w-full pw-grid pw-place-items-center pw-h-[14px] pw-bg-white pw-font-medium pw-text-xs pw-my-[14px]">
          <p>Copyright {new Date().getFullYear()} - [web/lock]</p>
        </div>
      )}
    </div>
  );
};

type SocialNetworkType =
  | 'twitter'
  | 'telegram'
  | 'discord'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'whatsapp'
  | 'website';
