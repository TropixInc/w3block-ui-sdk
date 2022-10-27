/* eslint-disable react/jsx-key */

import classNames from 'classnames';

import { ReactComponent as ComercialIcon } from '../../assets/icons/comercial.svg';
import { ReactComponent as FacebookIcon } from '../../assets/icons/facebookFilled.svg';
import { ReactComponent as LinkedinIcon } from '../../assets/icons/linkedinFilled.svg';
import { ReactComponent as LinkIcon } from '../../assets/icons/linkFilled.svg';
import { ReactComponent as TwitterIcon } from '../../assets/icons/twitterFilled.svg';
import { ReactComponent as WhatsappIcon } from '../../assets/icons/whatsappFilled.svg';
import { position } from '../../enums';
import { ExternalRoutes } from '../../enums/ExternalRoutes';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import useTranslation from '../../hooks/useTranslation';
import { PoweredBy } from '../PoweredBy';
import TranslatableComponent from '../TranslatableComponent';

interface SocialNetwork {
  id: string;
  url: string;
  type: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp' | 'url';
}

interface Url {
  path: string;
  label: string;
  className?: string;
}

interface W3blockFooterProps {
  socialNetworks?: Array<SocialNetwork>;
  links?: Array<Url>;
  bgColor?: string;
  textColor?: string;
  infoAboutSite?: string;
  poweredByLogoColor?: 'black' | 'white';
}

const socialNetWorkLinkSharedClassnames =
  'pw-fill-[#090909] hover:pw-fill-brand-primary pw-w-8 pw-h-8';

const defaultSocialNetworks: Array<SocialNetwork> = [
  {
    id: 'facebook',
    url: ExternalRoutes.FACEBOOK,
    type: 'facebook',
  },
  {
    id: 'twitter',
    url: ExternalRoutes.TWITTER,
    type: 'twitter',
  },
  {
    id: 'whatsapp',
    url: ExternalRoutes.WHATSAPP,
    type: 'whatsapp',
  },
  {
    id: 'linkedin',
    url: ExternalRoutes.LINKEDIN,
    type: 'linkedin',
  },
  {
    id: 'link',
    url: ExternalRoutes.LINK,
    type: 'url',
  },
];

const _W3blockFooter = ({
  socialNetworks = defaultSocialNetworks,
  links,
  bgColor = 'white',
  textColor = 'black',
  poweredByLogoColor = 'black',
  infoAboutSite,
}: W3blockFooterProps) => {
  const [translate] = useTranslation();
  const { logoUrl } = useCompanyConfig();

  const defaultLinks: Array<Url> = [
    {
      label: translate('home>footer>privacyPolicy'),
      path: PixwayAppRoutes.PRIVACY_POLICY,
      className: 'footer-link-privacypolicy',
    },
    {
      path: PixwayAppRoutes.TERMS_CONDITIONS,
      label: translate('home>footer>termsConditions'),
      className: 'footer-link-termsconditions',
    },
    {
      path: PixwayAppRoutes.FAQ,
      label: translate('home>footer>faq'),
      className: 'footer-link-faq',
    },
    {
      path: PixwayAppRoutes.CONTACT_US,
      label: translate('home>footer>contactUs'),
      className: 'footer-link-contactus',
    },
  ];

  const typeToIcon = new Map([
    [
      'facebook',
      <FacebookIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{ fill: textColor }}
      />,
    ],

    [
      'twitter',
      <TwitterIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{ fill: textColor }}
      />,
    ],

    [
      'whatsapp',
      <WhatsappIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{ fill: textColor }}
      />,
    ],

    [
      'linkedin',
      <LinkedinIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{ fill: textColor }}
      />,
    ],

    [
      'url',
      <LinkIcon
        className={socialNetWorkLinkSharedClassnames}
        style={{ fill: textColor }}
      />,
    ],
  ]);

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="pw-w-ful pw-shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] pw-flex pw-justify-center pw-relative "
    >
      <div className="pw-flex pw-py-[22px] sm:pw-py-4 pw-flex-col pw-gap-[15px] sm:pw-gap-4 pw-justify-center pw-items-center pw-max-w-[1440px] pw-w-full pw-text-[#090909]">
        <div className="pw-w-full pw-font-semibold pw-text-sm pw-leading-[17px] pw-gap-[7px] sm:pw-gap-[54px] pw-flex pw-items-center pw-justify-center pw-flex-col sm:pw-flex-row">
          <a href={PixwayAppRoutes.HOME} className="footer-link-logo">
            <img src={logoUrl} alt="logo" className="footer-logo-image" />
          </a>
          {(links ?? defaultLinks).map(({ label, path, className }) => (
            <a
              style={{ color: textColor }}
              href={path}
              className={className}
              key={path}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="pw-w-[304px] sm:pw-w-full pw-bg-[#090909] sm:pw-bg-[#E4E4E4] pw-h-[1px]" />
        <div
          style={{ color: textColor }}
          className="pw-max-w-[335px] sm:pw-max-w-[725px] pw-w-full pw-text-[13px] pw-leading-4s pw-text-center"
        >
          {infoAboutSite ??
            'A presente oferta de compra não se trata de recomendação de investimento e não foi concebida para prover lucro nem qualquer tipo de retorno financeiro e sim, tão e somente, o acesso ao clube de vantagens.'}
        </div>

        <div className="pw-w-full pw-flex pw-gap-4 pw-justify-center">
          {socialNetworks.map(({ type, id, url }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              className={classNames(
                socialNetWorkLinkSharedClassnames,
                'pw-w-8 pw-h-8'
              )}
              rel="noreferrer"
            >
              {typeToIcon.get(type)}
            </a>
          ))}
        </div>
        <div className="pw-w-[304px] sm:pw-w-full pw-bg-[#090909] sm:pw-bg-[#E4E4E4] pw-h-[1px]" />
        <div
          style={{ color: textColor }}
          className="pw-flex pw-items-center pw-gap-1 pw-font-normal pw-text-xs pw-leading-[15px] pw-text-center"
        >
          <ComercialIcon
            style={{ fill: textColor }}
            className="pw-h-4 pw-w-4"
          />
          {translate('home>footer>copyright')}
        </div>
        <PoweredBy
          classes={{
            title:
              poweredByLogoColor === 'black'
                ? 'pw-text-black'
                : 'pw-text-white',
          }}
          PwPosition={position.CENTER}
          logoColor={poweredByLogoColor}
        />
      </div>
    </div>
  );
};

export const W3blockFooter = (props: W3blockFooterProps) => (
  <TranslatableComponent>
    <_W3blockFooter {...props} />
  </TranslatableComponent>
);
