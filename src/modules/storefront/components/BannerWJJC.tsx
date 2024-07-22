import { lazy } from 'react';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import _ from 'lodash';

import { useGetAthleteByAddress } from '../../custom/kyraGracie/hooks/useGetAthleteByAddress';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { useLocale } from '../../shared/hooks/useLocale';
import useTranslation from '../../shared/hooks/useTranslation';
import { composeUrlCloudinary } from '../../shared/utils/composeUrlCloudinary';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useDynamicString } from '../hooks/useDynamicString';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { BannerWJJCData, SpecificBannerInfo } from '../interfaces';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDynamicApi } from '../provider/DynamicApiProvider';
import { SocialNetworks } from './SocialNetworks';

const ImageSDK = lazy(() =>
  import('../../shared/components/ImageSDK').then((module) => ({
    default: module.ImageSDK,
  }))
);
export const BannerWJJC = ({ data }: { data: BannerWJJCData }) => {
  const { styleData, mobileStyleData, id } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const { banners, bannerDisposition, margin, padding } = mergedStyleData;
  const layoutClass =
    bannerDisposition === 'fullWidth' ? 'pw-w-full' : 'pw-container';

  return (
    <TranslatableComponent>
      <div
        id={`sf-${id}`}
        className={`${layoutClass} pw-mx-auto`}
        style={{
          margin: convertSpacingToCSS(margin),
        }}
      >
        <Banner key={banners?.title} data={{ ...banners, padding }} />
      </div>
    </TranslatableComponent>
  );
};

const Banner = ({ data }: { data: SpecificBannerInfo }) => {
  const {
    titleColor,
    overlayColor,
    backgroundUrl,
    backgroundUrlMobile,
    title: titleRaw,
    padding,
    overlay,
    titleFontFamily,
    titleFontSize,
    titleFontBold,
    titleFontItalic,
    titleFontSizeType,
    sideImageUrl,
    baseUrl,
    titleTextShadow,
    titleMaxWidth,
    titleTextAlign,
    imageCompression,
  } = data;
  const { isDynamic, datasource } = useDynamicApi();
  const { text: title } = useDynamicString(titleRaw);
  const [translate] = useTranslation();
  const { data: athleteData } = useGetAthleteByAddress(
    datasource?.master?.data[0]?.id ?? '',
    '0x30905c662ce29c4c4fc527edee57a47c808f3213',
    '1284'
  );

  const locale = useLocale();
  const breakpoint = useBreakpoints();
  const bgUrl =
    backgroundUrlMobile &&
    (breakpoint == breakpointsEnum.SM || breakpoint == breakpointsEnum.XS)
      ? backgroundUrlMobile
      : backgroundUrl;

  const bgUrlThreath = composeUrlCloudinary({
    src: bgUrl?.assetUrl ?? '',
    InternalProps: {
      width: imageCompression === 'no-compression' ? undefined : 1920,
      quality: imageCompression ?? 'best',
    },
  });
  const bg = `${
    overlay && overlayColor
      ? `linear-gradient(${overlayColor},${overlayColor}),`
      : ''
  } url("${
    isDynamic
      ? _.get(datasource, bgUrl?.assetUrl ?? '', bgUrlThreath)
      : bgUrlThreath
  }") no-repeat center`;

  const showTitle = () => {
    if (datasource?.master?.data[0]?.attributes?.grandMaster) {
      return (
        <p className="pw-text-xs pw-font-bold pw-font-poppins pw-text-black pw-bg-[#FCFBD8] pw-rounded-[14px] pw-p-[5px_10px] pw-text-center pw-mt-5">
          {translate('storefront>bannerWjjc>grandMaster')}
        </p>
      );
    } else if (datasource?.master?.data[0]?.attributes?.ambassador) {
      return (
        <p className="pw-text-xs pw-font-bold pw-font-poppins pw-text-black pw-bg-[#FCFBD8] pw-rounded-[14px] pw-p-[5px_10px] pw-text-center pw-mt-5">
          {translate('storefront>bannerWjjc>amabassador')}
        </p>
      );
    } else if (datasource?.master?.data[0]?.attributes?.master) {
      return (
        <p className="pw-text-xs pw-font-bold pw-font-poppins pw-text-black pw-bg-[#FCFBD8] pw-rounded-[14px] pw-p-[5px_10px] pw-text-center pw-mt-5">
          {translate('storefront>bannerWjjc>teacher')}
        </p>
      );
    } else return null;
  };

  const showBelt = () => {
    const currentBelt = datasource?.master?.data[0]?.attributes?.titles.filter(
      (res: { currentBelt: string }) => res?.currentBelt
    )[0]?.belt;
    if (currentBelt)
      return (
        <p className="pw-text-xs pw-font-bold pw-font-poppins pw-text-black pw-bg-[#FFFFFF] pw-rounded-[14px] pw-p-[5px_10px] pw-text-center pw-mt-5">
          {translate('storefront>bannerWjjc>belt')} {currentBelt}
        </p>
      );
    else return null;
  };

  const showNomination = () => {
    const ambassador =
      datasource?.master?.data[0]?.attributes?.masterCertificationAmbassador
        ?.data?.attributes.name;
    const grandMaster =
      datasource?.master?.data[0]?.attributes?.masterCertificationGrandMaster
        ?.data?.attributes.name;
    if (ambassador && grandMaster)
      return (
        <div>
          {' '}
          - {translate('storefront>bannerWjjc>nominatedBy')}{' '}
          <a
            target="_blank"
            href={`/professor/${datasource?.master?.data[0]?.attributes?.masterCertificationAmbassador?.data?.attributes.slug}`}
            rel="noreferrer"
            className="pw-underline pw-text-[#0812FF]"
          >
            {ambassador}
          </a>{' '}
          {translate('storefront>bannerWjjc>decoratedBy')}{' '}
          <a
            target="_blank"
            href={`/professor/${datasource?.master?.data[0]?.attributes?.masterCertificationGrandMaster?.data?.attributes.slug}`}
            rel="noreferrer"
            className="pw-underline pw-text-[#0812FF]"
          >
            {grandMaster}
          </a>
        </div>
      );
    else if (ambassador)
      return (
        <div>
          {' '}
          - {translate('storefront>bannerWjjc>nominatedBy')}{' '}
          <a
            target="_blank"
            href={`/professor/${datasource?.master?.data[0]?.attributes?.masterCertificationAmbassador?.data?.attributes.slug}`}
            rel="noreferrer"
            className="pw-underline pw-text-[#0812FF]"
          >
            {ambassador}
          </a>
        </div>
      );
    else if (grandMaster)
      return (
        <div>
          {' '}
          - {translate('storefront>bannerWjjc>decoratedBy')}{' '}
          <a
            target="_blank"
            href={`/professor/${datasource?.master?.data[0]?.attributes?.masterCertificationGrandMaster?.data?.attributes.slug}`}
            rel="noreferrer"
            className="pw-underline pw-text-[#0812FF]"
          >
            {grandMaster}
          </a>
        </div>
      );
    else return null;
  };

  const getPlace = (firstPlace?: string, secondPlace?: string) => {
    const arr = [];
    if (firstPlace) arr.push(firstPlace);
    if (secondPlace) arr.push(secondPlace);
    const finalPlace = arr.join(', ');
    return finalPlace;
  };

  const isMasterOrProfessor =
    datasource?.master?.data[0]?.attributes?.grandMaster ||
    datasource?.master?.data[0]?.attributes?.ambassador ||
    datasource?.master?.data[0]?.attributes?.master;

  if (!datasource || !data) return null;
  else
    return (
      <>
        <div
          style={{
            backgroundSize: '',
            background: bg,
            padding: convertSpacingToCSS(padding),
          }}
          className={`!pw-bg-cover pw-h-full pw-w-full sm:pw-p-0 pw-p-8`}
        >
          {isMasterOrProfessor ? (
            <div className="pw-container pw-mx-auto pw-flex sm:pw-flex-row pw-flex-col pw-gap-8">
              {sideImageUrl && sideImageUrl.assetUrl ? (
                <ImageSDK
                  src={
                    isDynamic
                      ? baseUrl
                        ? baseUrl +
                          _.get(
                            datasource,
                            sideImageUrl?.assetUrl ?? '',
                            sideImageUrl?.assetUrl ?? ''
                          )
                        : _.get(
                            datasource,
                            sideImageUrl?.assetUrl ?? '',
                            sideImageUrl?.assetUrl ?? ''
                          )
                      : sideImageUrl?.assetUrl ?? ''
                  }
                  className="pw-object-contain pw-h-[400px]"
                />
              ) : null}
              <div className="pw-flex pw-flex-col pw-gap-6 pw-pt-[40px]">
                <div>
                  <h2
                    style={{
                      color: titleColor ?? 'white',
                      fontFamily: titleFontFamily ?? '',
                      fontSize:
                        titleFontSize &&
                        titleFontSize != '' &&
                        titleFontSize != '0'
                          ? titleFontSize +
                            (titleFontSizeType == 'rem' ? 'rem' : 'px')
                          : '',
                      fontWeight:
                        titleFontBold != undefined
                          ? titleFontBold
                            ? 'bold'
                            : 'normal'
                          : 'bold',
                      fontStyle: titleFontItalic ? 'italic' : 'normal',
                      lineHeight:
                        titleFontSize &&
                        titleFontSize != '' &&
                        titleFontSize != '0' &&
                        titleFontSizeType != 'rem'
                          ? (
                              parseInt(titleFontSize) -
                              parseInt(titleFontSize) * 0.05
                            ).toFixed(0) + 'px'
                          : 'auto',
                      textShadow: titleTextShadow ?? 'none',
                      maxWidth: titleMaxWidth ?? '550px',
                    }}
                    className={`${
                      titleTextAlign ?? ''
                    } pw-font-semibold pw-text-[36px] pw-max-w-[550px] pw-font-poppins`}
                  >
                    {title}
                  </h2>
                  <div className="pw-flex pw-gap-3">
                    {showTitle()}
                    {showBelt()}
                  </div>
                </div>
                <div className="pw-flex sm:pw-flex-row pw-flex-col sm:pw-gap-40 pw-gap-8">
                  <div className="pw-flex pw-flex-col pw-gap-2">
                    {datasource?.master?.data[0]?.attributes?.birthdate && (
                      <div>
                        <p className="pw-font-normal pw-text-sm pw-font-poppins pw-text-black">
                          {translate('storefront>bannerWjjc>bithDate')}
                        </p>
                        <p className="pw-font-bold pw-text-lg pw-font-poppins pw-text-black">
                          {format(
                            Date.parse(
                              datasource?.master?.data[0]?.attributes
                                ?.birthdate + 'T12:00:00' ?? ''
                            ),
                            'P',
                            { locale: locale === 'pt-BR' ? ptBR : enUS }
                          )}
                        </p>
                      </div>
                    )}
                    {translate(
                      `country>${datasource?.master?.data[0]?.attributes?.placeOfBirth?.city}` ||
                        `country>${datasource?.master?.data[0]?.attributes?.placeOfBirth?.country}`
                    ) && (
                      <div>
                        <p className="pw-font-normal pw-text-sm pw-font-poppins pw-text-black">
                          {translate('storefront>bannerWjjc>bithplace')}
                        </p>
                        <p className="pw-font-bold pw-text-lg pw-font-poppins pw-text-black">
                          {getPlace(
                            datasource?.master?.data[0]?.attributes
                              ?.placeOfBirth?.city,
                            translate(
                              datasource?.master?.data[0]?.attributes
                                ?.placeOfResidence?.country
                            )
                          )}
                        </p>
                      </div>
                    )}
                    {translate(
                      `country>${datasource?.master?.data[0]?.attributes?.placeOfResidence?.city}` ||
                        `country>${datasource?.master?.data[0]?.attributes?.placeOfResidence?.country}`
                    ) && (
                      <div>
                        <p className="pw-font-normal pw-text-sm pw-font-poppins pw-text-black">
                          {translate('storefront>bannerWjjc>residence')}
                        </p>
                        <p className="pw-font-bold pw-text-lg pw-font-poppins pw-text-black">
                          {getPlace(
                            datasource?.master?.data[0]?.attributes
                              ?.placeOfResidence?.city,
                            translate(
                              datasource?.master?.data[0]?.attributes
                                ?.placeOfResidence?.country
                            )
                          )}
                        </p>
                      </div>
                    )}
                    <SocialNetworks
                      title="Canais Oficiais"
                      data={
                        datasource?.master?.data[0]?.attributes
                          ?.socialNetworks[0]
                      }
                    />
                  </div>
                  <div className="pw-flex pw-flex-col pw-gap-2">
                    {datasource?.master?.data[0]?.attributes?.achievements.map(
                      (
                        res: { title: string; subtitle: string },
                        index: number
                      ) =>
                        index < 3 && (
                          <div key={index}>
                            <p className="pw-font-bold pw-text-lg pw-font-poppins pw-text-[#295BA6]">
                              {res?.title}
                            </p>
                            <p className="pw-font-normal pw-text-xs pw-font-poppins pw-text-black">
                              {res?.subtitle}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {isMasterOrProfessor ? (
          <div className="pw-container pw-mx-auto sm:pw-p-[48px_0_0_0] pw-p-8 ">
            <h2 className="pw-text-black pw-font-semibold pw-text-2xl pw-font-poppins">
              {translate('storefront>bannerWjjc>instructorSince')}
            </h2>
            {datasource?.master?.data[0]?.attributes
              ?.masterCertificationDate && (
              <p className="pw-text-black pw-font-medium pw-text-sm pw-font-poppins pw-mt-5 pw-flex">
                {format(
                  Date.parse(
                    datasource?.master?.data[0]?.attributes
                      ?.masterCertificationDate + 'T12:00:00' ?? ''
                  ),
                  'P',
                  { locale: locale === 'pt-BR' ? ptBR : enUS }
                )}
                {showNomination()}
              </p>
            )}
            <div className="pw-flex pw-gap-4 pw-mt-5">
              {athleteData?.items.length ? (
                <a
                  href={`https://pdf.wjjc.io/certification/0x30905c662ce29c4c4fc527edee57a47c808f3213/1284/?instructorIdentification=${datasource?.master?.data[0]?.id}&preview`}
                  target="_blank"
                  className="pw-p-[5px_24px_5px_24px] pw-bg-[#295BA6] pw-border-solid pw-border-[1px] pw-border-[#FFFFFF] pw-text-white pw-rounded-[16px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] pw-font-poppins pw-text-xs"
                  rel="noreferrer"
                >
                  {translate('storefront>bannerWjjc>checkCertification')}
                </a>
              ) : null}
              <a
                href={`https://wjjc.io/praticante/${datasource?.master?.data[0]?.attributes?.slug}`}
                target="_blank"
                className="pw-p-[5px_24px_5px_24px] pw-bg-[#295BA6] pw-border-solid pw-border-[1px] pw-border-[#FFFFFF] pw-text-white pw-rounded-[16px] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] pw-font-poppins pw-text-xs"
                rel="noreferrer"
              >
                {translate('storefront>bannerWjjc>checkHistory')}
              </a>
            </div>
          </div>
        ) : null}
      </>
    );
};
