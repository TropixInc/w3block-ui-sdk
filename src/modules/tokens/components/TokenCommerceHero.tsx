import classNames from 'classnames';

import ArrowIcon from '../../shared/assets/icons/arrowLeftOutlined.svg';

import { BreadCrumb } from '../../shared/components/Breadcrumb';
import useTranslation from '../../shared/hooks/useTranslation';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';

export interface Source {
  type: 'video' | 'image';
  src: string;
}

interface TokenCommerceHeroProps {
  tokenSrc?: Source;
  tokenName?: string;
  tokenSubtitle?: string;
  tokenPrice?: string;
  tokenCategories?: Array<string>;
  container?: boolean;
}

export const TokenCommerceHero = ({
  tokenCategories,
  tokenName,
  tokenSubtitle,
  tokenPrice,
  tokenSrc,
  container,
}: TokenCommerceHeroProps) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const crumbs = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Tokens',
      href: '/tokens',
    },
    {
      title: tokenName,
    },
  ];

  return (
    <>
      <div
        className={classNames(
          'pw-py-[31px] pw-pl-[69px] pw-bg-white pw-flex pw-justify-start pw-items-center pw-font-poppins pw-font-normal pw-text-sm',
          container && 'pw-container pw-mx-auto'
        )}
      >
        <ArrowIcon
          onClick={() => router.back()}
          className="pw-stroke-[#353945] pw-mr-[30px] pw-cursor-pointer"
        />
        {translate('token>commerceTemplate>back')}
      </div>
      <div className="pw-bg-[#EFEFEF] ">
        <div
          className={classNames(
            container && 'pw-container pw-mx-auto',
            'pw-px-[69px] pw-pb-[56px] pw-pt-[20px]'
          )}
        >
          <BreadCrumb crumbs={crumbs} className="sm:pw-block pw-hidden" />
          <div className="pw-flex pw-flex-col sm:pw-flex-row pw-mt-[20px]">
            <div className="sm:pw-max-w-[630px] sm:pw-max-h-[514px] pw-max-w-[347px] pw-max-h-[283px]">
              {tokenSrc?.type === 'image' ? (
                <img src={tokenSrc?.src} alt="token image" />
              ) : (
                <video src={tokenSrc?.src} autoPlay muted loop />
              )}
            </div>
            <div className="pw-font-poppins sm:pw-ml-[40px] pw-ml-0 sm:pw-mt-0 pw-mt-[20px]">
              <p className="pw-text-sm pw-font-normal">
                {translate('token>commerceTemplate>title')}
              </p>
              <p className="sm:pw-text-4xl pw-text-2xl pw-font-semibold">
                {tokenName}
              </p>
              {tokenSubtitle && (
                <p className="pw-text-sm pw-font-normal pw-mt-4">
                  {tokenSubtitle}
                </p>
              )}
              {tokenPrice && (
                <p className="pw-text-2xl pw-font-semibold pw-mt-4">
                  {tokenPrice}
                </p>
              )}
              {tokenCategories && (
                <>
                  <p className="pw-text-sm pw-font-normal pw-mt-4">
                    {translate('token>commerceTemplate>categories')}
                  </p>
                  <div className="pw-flex pw-mt-4">
                    {tokenCategories.map((value, index) => (
                      <div
                        key={index}
                        className="pw-p-[8px_16px] pw-bg-[#F7F7F7] pw-border-[#575757] pw-rounded-[5px] pw-border pw-w-[120px] pw-mr-[32px] pw-text-center"
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
