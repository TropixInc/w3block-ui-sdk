import { useContext } from 'react';
import { useLocalStorage } from 'react-use';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PRACTITIONER_DATA_INFO_KEY } from '../../checkout/config/keys/localStorageKey';
import { Grade } from '../../custom';
import { ContentTypeEnum } from '../../poll';
import { position, useRouterConnect } from '../../shared';
import { Box } from '../../shared/components/Box/Box';
import { ContainerControllerSDK } from '../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { Shimmer } from '../../shared/components/Shimmer';
import { WeblockButton } from '../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import useTranslation from '../../shared/hooks/useTranslation';
import { generateRandomUUID } from '../../shared/utils/generateRamdomUUID';
import { ThemeContext } from '../contexts';
import { useDynamicApi } from '../provider/DynamicApiProvider';

export const WjjcStart = () => {
  const { datasource } = useDynamicApi();
  const [translate] = useTranslation();

  const [_, setInfoData] = useLocalStorage(PRACTITIONER_DATA_INFO_KEY);
  const id = generateRandomUUID();
  const { pushConnect } = useRouterConnect();
  const date = () => {
    try {
      if (datasource?.athlete?.data[0]?.attributes?.certificationDate)
        return format(
          Date.parse(
            datasource?.athlete?.data[0]?.attributes?.certificationDate +
              'T12:00:00'
          ),
          'P',
          { locale: ptBR }
        );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    return '';
  };

  const gradeMap = {
    degree_1: '1º grau',
    degree_2: '2º grau',
    degree_3: '3º grau',
    degree_4: '4º grau',
    degree_5: '5º grau',
  };

  const title = () => {
    const text = datasource?.athlete?.data[0]?.attributes?.degree
      ? gradeMap[datasource?.athlete?.data[0]?.attributes?.degree as Grade] +
        ' da Faixa ' +
        datasource?.athlete?.data[0]?.attributes?.belt
      : 'Faixa ' + datasource?.athlete?.data[0]?.attributes?.belt;
    return text;
  };

  const firstLoading = Object.keys(datasource).length < 1;

  const onContinue = () => {
    const productIds = () => {
      const arr = [];
      if (datasource?.athlete?.data[0]?.attributes?.affiliationProductId)
        arr.push(
          datasource?.athlete?.data[0]?.attributes?.affiliationProductId
        );
      if (datasource?.athlete?.data[0]?.attributes?.certificationProductId)
        arr.push(
          datasource?.athlete?.data[0]?.attributes?.certificationProductId
        );
      const productsId = arr.join(',');
      return productsId;
    };

    const products = () => {
      const arr = [];
      if (datasource?.athlete?.data[0]?.attributes?.affiliationProductId)
        arr.push({
          productId:
            datasource?.athlete?.data[0]?.attributes?.affiliationProductId,
          tokenId: datasource?.athlete?.data[0]?.attributes?.affiliationTokenId,
        });
      if (datasource?.athlete?.data[0]?.attributes?.certificationProductId)
        arr.push({
          productId:
            datasource?.athlete?.data[0]?.attributes?.certificationProductId,
          tokenId:
            datasource?.athlete?.data[0]?.attributes?.certificationTokenId,
        });
      return arr;
    };

    setInfoData({
      [id]: {
        certificate: {
          name: datasource?.athlete?.data[0]?.attributes?.name,
          academy:
            datasource?.athlete?.data[0]?.attributes?.academy?.data?.attributes
              ?.name,
          master:
            datasource?.athlete?.data[0]?.attributes?.master?.data?.attributes
              ?.name,
          certificationDate: date(),
          title: title(),
        },
        products: products(),
        postKycUrl: `/checkout/confirmation?productIds=${productIds()}&currencyId=65fe1119-6ec0-4b78-8d30-cb989914bdcb&sessionId=${id}`,
        postCheckoutUrl: '/',
      },
    });
    if (datasource?.athlete?.data[0]?.attributes?.affiliationProductId) {
      pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
        contextSlug: 'wjjcstart',
        step: 1,
        sessionId: id,
        formState: 'initial',
      });
    } else {
      pushConnect(
        `/checkout/confirmation?productIds=${productIds()}&currencyId=65fe1119-6ec0-4b78-8d30-cb989914bdcb&sessionId=${id}`
      );
    }
  };

  const context = useContext(ThemeContext);

  return (
    <ContainerControllerSDK
      logoUrl={
        context?.defaultTheme?.configurations?.styleData?.onBoardingLogoSrc
          ?.assetUrl ?? ''
      }
      fullScreen
      infoPosition={position.RIGHT}
      contentType={ContentTypeEnum.TEXT_LOGO}
      separation={false}
      textContainer={{
        mainText: translate('storefront>wjjcStart>formCertification'),
        subtitleText: translate(
          'storefront>wjjcStart>welcomeProcessCertification'
        ),
        auxiliarText: translate('storefront>wjjcStart>confirmDataGraduation'),
      }}
      infoComponent={
        <Box>
          <div className="pw-flex pw-flex-col pw-items-center">
            <p className="pw-font-poppins sm:pw-text-[24px] pw-text-lg pw-text-[#35394C] pw-font-[700] pw-text-center pw-max-w-[369px]">
              {translate('storefront>wjjcStart>confirmDataForCertification')}
            </p>
            <div className="pw-text-lg pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-items-start pw-justify-center pw-w-full pw-mt-5">
              <h3 className="pw-font-semibold">
                {translate('auth>confirmationKycWithoutLayout>fullName')}
              </h3>
              {firstLoading ? (
                <Shimmer className="pw-min-h-[22px] pw-min-w-[200px] pw-mt-3" />
              ) : (
                <p className="pw-font-normal">
                  {datasource?.athlete?.data[0]?.attributes?.name}
                </p>
              )}
              <h3 className="pw-font-semibold pw-mt-5">
                {translate('auth>confirmationKycWithoutLayout>conquest')}
              </h3>
              {firstLoading ? (
                <Shimmer className="pw-min-h-[22px] pw-min-w-[200px] pw-mt-3" />
              ) : (
                <p className="pw-font-normal">{title()}</p>
              )}
              <h3 className="pw-font-semibold pw-mt-5">
                {translate('auth>confirmationKycWithoutLayout>teacherName')}
              </h3>
              {firstLoading ? (
                <Shimmer className="pw-min-h-[22px] pw-min-w-[200px] pw-mt-3" />
              ) : (
                <p className="pw-font-normal">
                  {
                    datasource?.athlete?.data[0]?.attributes?.master?.data
                      ?.attributes?.name
                  }
                </p>
              )}
              <h3 className="pw-font-semibold pw-mt-5">
                {translate('auth>confirmationKycWithoutLayout>academy')}
              </h3>
              {firstLoading ? (
                <Shimmer className="pw-min-h-[22px] pw-min-w-[200px] pw-mt-3" />
              ) : (
                <p className="pw-font-normal">
                  {
                    datasource?.athlete?.data[0]?.attributes?.academy?.data
                      ?.attributes?.name
                  }
                </p>
              )}
              <h3 className="pw-font-semibold pw-mt-5">
                {translate('auth>confirmationKycWithoutLayout>cerimonyDate')}
              </h3>
              {firstLoading ? (
                <Shimmer className="pw-min-h-[22px] pw-min-w-[200px] pw-mt-3" />
              ) : (
                <p className="pw-font-normal">{date()}</p>
              )}
            </div>
            <WeblockButton
              onClick={onContinue}
              className="pw-mt-5 pw-text-white"
              fullWidth={true}
            >
              {translate('components>advanceButton>continue')}
            </WeblockButton>
            <p className="pw-font-poppins pw-font-normal pw-text-black pw-text-xs pw-text-center pw-mt-2">
              {translate('storefront>wjjcStart>caseIncorrectInfo')}
            </p>
          </div>
        </Box>
      }
    />
  );
};
