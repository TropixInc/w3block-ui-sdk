import { CSSProperties } from 'react';

import { ReactComponent as DiscordIcon } from '../../shared/assets/icons/discord.svg';
import { ReactComponent as FacebookIcon } from '../../shared/assets/icons/facebook.svg';
import { ReactComponent as GlobeIcon } from '../../shared/assets/icons/globe.svg';
import { ReactComponent as InstagramIcon } from '../../shared/assets/icons/instagram.svg';
import { ReactComponent as LinkedinIcon } from '../../shared/assets/icons/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../../shared/assets/icons/message.svg';
import { ReactComponent as TwitterIcon } from '../../shared/assets/icons/twitter.svg';
import { ReactComponent as WhatsappIcon } from '../../shared/assets/icons/whatsapp.svg';
import { FooterData } from '../interfaces';

import './Footer.css';

type SVG = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

export const Footer = ({ data }: { data: FooterData }) => {
  const { styleData, contentData } = data;
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
  } = styleData;

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

  const sampleSocialLinks = [
    {
      url: 'https://twitter.com/',
      type: 'twitter',
    },
    {
      url: 'https://web.telegram.org/',
      type: 'telegram',
    },
    {
      url: 'https://discord.com/',
      type: 'discord',
    },
    {
      url: 'https://www.instagram.com/',
      type: 'instagram',
    },
    {
      url: 'https://www.facebook.com/',
      type: 'facebook',
    },
    {
      url: 'https://www.linkedin.com/',
      type: 'linkedin',
    },
    {
      url: 'https://www.whatsapp.com/',
      type: 'whatsapp',
    },
    {
      url: 'https://example.com/',
      type: 'website',
    },
  ];

  return (
    <>
      <div
        style={{ backgroundColor }}
        className="pw-w-full pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-items-center"
      >
        <div className="pw-pb-6 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full pw-pt-10">
          <div className="pw-w-full pw-font-semibold pw-text-sm pw-gap-2 sm:pw-gap-[26px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row pw-font-roboto">
            {menuLinks
              ?.map((l: any) => ({ label: l.name, value: l.slug }))
              ?.map(({ label, value }) => (
                <a
                  key={value}
                  href={value}
                  className="footer-menu"
                  style={
                    {
                      textDecoration: 'none',
                      '--footer-menu-color': menuLinksColor,
                      '--footer-menu-hover-color': menuLinksHoverColor,
                    } as CSSProperties
                  }
                >
                  {label}
                </a>
              ))}
          </div>

          <div className="pw-w-full pw-bg-[#2D66E2] pw-h-[1px] pw-my-[10px]" />

          <div
            style={{ color: textColor }}
            className="pw-text-sm pw-leading-5 pw-text-center pw-px-7 sm:pw-px-28"
          >
            <p className="pw-text-center pw-font-roboto">
              {contentData?.description ||
                'O Clube não se trata de oferta de valores mobiliários ou investimento coletivo. A presente oferta de compra não se trata de recomendação de investimento e não foi concebida para prover lucro nem qualquer tipo de retorno financeiro e sim, tão e somente, o acesso ao clube de vantagens do XPTO.'}
            </p>
          </div>

          {socialNetworks && (
            <div className="pw-w-full pw-flex pw-flex-wrap pw-gap-2 pw-justify-center pw-pt-4">
              {(contentData?.socialNetworkItems || sampleSocialLinks)?.map(
                ({ type, url }) => {
                  const Icon = iconsMap[type];

                  return (
                    <a
                      key={type}
                      href={url}
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
                }
              )}
            </div>
          )}
        </div>
      </div>

      {w3blockSignature && (
        <div className="pw-w-full pw-grid pw-place-items-center pw-h-[14px] pw-bg-white pw-font-roboto pw-font-medium pw-text-xs pw-py-[14px]">
          Copyright {new Date().getFullYear()} - [web/lock]
        </div>
      )}
    </>
  );
};

export type SocialNetworkType =
  | 'twitter'
  | 'telegram'
  | 'discord'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'whatsapp'
  | 'website';
