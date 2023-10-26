/* eslint-disable react/jsx-key */

import { CSSProperties, useContext } from 'react';

import { ThemeContext, ThemeProvider } from '../../../storefront/contexts';
import { FooterData } from '../../../storefront/interfaces';
import DiscordIcon from '../../assets/icons/discord.svg?react';
import FacebookIcon from '../../assets/icons/facebook.svg?react';
import GlobeIcon from '../../assets/icons/globe.svg?react';
import InstagramIcon from '../../assets/icons/instagram.svg?react';
import LinkedinIcon from '../../assets/icons/linkedin.svg?react';
import TelegramIcon from '../../assets/icons/message.svg?react';
import TwitterIcon from '../../assets/icons/twitter.svg?react';
import W3blockLogo from '../../assets/icons/weblock_logo.svg?react';
import WhatsappIcon from '../../assets/icons/whatsapp.svg?react';
import { convertSpacingToCSS } from '../../utils/convertSpacingToCSS';
import { ExtraBy } from '../PoweredBy';
import TranslatableComponent from '../TranslatableComponent';

interface SocialNetwork {
  id: string;
  url: string;
  type: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp' | 'url';
}

interface Url {
  router: string;
  name: string;
}

interface W3blockFooterProps {
  socialNetworks?: Array<SocialNetwork>;
  links?: Array<Url>;
  bgColor?: string;
  textColor?: string;
  infoAboutSite?: string;
  poweredByLogoColor?: 'black' | 'white';
  extraBy?: ExtraBy[];
}

type SVG = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

const _W3blockFooter = ({
  socialNetworks,
  links,
  bgColor = 'white',
  textColor = 'black',
  infoAboutSite,
}: W3blockFooterProps) => {
  const context = useContext(ThemeContext);

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
    url:
      context?.defaultTheme?.footer?.contentData?.[name] ??
      socialNetworks?.find((sn) => sn.type == name),
    type: name as SocialNetworkType,
  }));

  const styleData = context?.defaultTheme?.footer?.styleData;
  const contentData = context?.defaultTheme?.footer?.contentData;
  return context?.isThemeError || context?.isThemeSuccess ? (
    <div
      style={{
        margin: convertSpacingToCSS(styleData?.margin),
        padding: convertSpacingToCSS(styleData?.padding),
      }}
    >
      <div
        style={{ backgroundColor: styleData?.backgroundColor ?? bgColor }}
        className="pw-w-full pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-items-center"
      >
        <div className="pw-pb-6 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full pw-pt-10">
          <div className="pw-w-full pw-font-semibold pw-text-sm pw-gap-2 sm:pw-gap-[26px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row">
            {styleData?.menuLinks
              ? styleData?.menuLinks?.map(({ label, value }) => (
                  <a
                    key={label}
                    href={value}
                    className="footer-menu"
                    style={
                      {
                        textDecoration: 'none',
                        '--footer-menu-color':
                          styleData?.menuLinksColor ?? textColor,
                        '--footer-menu-hover-color':
                          styleData?.menuLinksHoverColor ?? textColor,
                      } as CSSProperties
                    }
                  >
                    {label}
                  </a>
                ))
              : links?.map((link) => (
                  <a
                    key={link.name}
                    href={link.router}
                    className="footer-menu"
                    style={
                      {
                        textDecoration: 'none',
                        '--footer-menu-color':
                          styleData?.menuLinksColor ?? textColor,
                        '--footer-menu-hover-color':
                          styleData?.menuLinksHoverColor ?? textColor,
                      } as CSSProperties
                    }
                  >
                    {link.name}
                  </a>
                ))}
          </div>

          <div className="pw-w-full pw-bg-[#ffffffaa] pw-h-[1px] pw-my-[10px]" />

          <div
            style={{ color: textColor }}
            className="pw-text-sm pw-leading-5 pw-text-center pw-px-7 sm:pw-px-28"
          >
            <p className="pw-text-center">
              {contentData?.description ?? infoAboutSite}
            </p>
          </div>

          {socialNetworks && (
            <div className="pw-w-full pw-flex pw-flex-wrap pw-gap-2 pw-justify-center pw-pt-4">
              {socialLinks.map((socialLink) => {
                if (!socialLink.url || socialLink.url == '') return null;

                const Icon = iconsMap[socialLink.type];

                return (
                  <a
                    key={socialLink.type}
                    href={socialLink.url.toString()}
                    target="_blank"
                    className="pw-rounded-full pw-grid pw-place-items-center pw-p-2 footer-social-network"
                    style={
                      {
                        '--footer-social-network-color':
                          styleData?.socialNetworksIconColor ?? textColor,
                        '--footer-social-network-hover-color':
                          styleData?.socialNetworksIconHoverColor ?? textColor,
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

      {styleData?.w3blockSignature && (
        <div className="pw-w-full pw-py-[14px] pw-flex pw-justify-center pw-itens-center pw-place-items-center pw-h-[14px] pw-bg-white pw-font-medium pw-text-xs">
          <p>Copyright {new Date().getFullYear()} -</p>
          <W3blockLogo className="pw-h-20px" />
        </div>
      )}
    </div>
  ) : null;
};

export const W3blockFooter = (props: W3blockFooterProps) => (
  <TranslatableComponent>
    <ThemeProvider>
      <_W3blockFooter {...props} />
    </ThemeProvider>
  </TranslatableComponent>
);

type SocialNetworkType =
  | 'twitter'
  | 'telegram'
  | 'discord'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'whatsapp'
  | 'website';
