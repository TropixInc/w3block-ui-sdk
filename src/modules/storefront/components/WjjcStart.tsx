import { useLocalStorage } from 'react-use';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PRACTITIONER_DATA_INFO_KEY } from '../../checkout/config/keys/localStorageKey';
import { Grade } from '../../custom';
import { ContentTypeEnum } from '../../poll';
import { position, useRouterConnect } from '../../shared';
import { Box } from '../../shared/components/Box/Box';
import { ContainerControllerSDK } from '../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { WeblockButton } from '../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { generateRandomUUID } from '../../shared/utils/generateRamdomUUID';
import { useDynamicApi } from '../provider/DynamicApiProvider';

export const WjjcStart = () => {
  const { datasource } = useDynamicApi();

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
  };

  const title = () => {
    const text =
      gradeMap[datasource?.athlete?.data[0]?.attributes?.degree as Grade] +
      ' da Faixa ' +
      datasource?.athlete?.data[0]?.attributes?.belt;
    return text;
  };

  const onContinue = () => {
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
      },
    });
    pushConnect(PixwayAppRoutes.COMPLETE_KYC, {
      contextSlug: 'wjjcInfo',
      step: 1,
      id,
    });
  };

  return (
    <ContainerControllerSDK
      fullScreen
      infoPosition={position.RIGHT}
      contentType={ContentTypeEnum.TEXT_LOGO}
      separation={false}
      textContainer={{
        mainText: 'Formulário de certificação de praticantes',
        subtitleText:
          'Bem vindo(a) ao processo de certificação de praticantes da World Jiu-Jitsu Certifier (WJJC)',
        auxiliarText:
          'Confirme e preencha seus dados complementares para finalizar a sua graduaçao da WJJC.',
      }}
      infoComponent={
        <Box>
          <div className="pw-flex pw-flex-col pw-items-center">
            <p className="pw-font-poppins sm:pw-text-[24px] pw-text-lg pw-text-[#35394C] pw-font-[700] pw-text-center pw-max-w-[369px]">
              Confirme os dados da certificação do praticante
            </p>
            <div className="pw-text-lg pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-gap-[2px] pw-items-start pw-justify-center pw-w-full pw-mt-5">
              <h3 className="pw-font-semibold">Nome completo</h3>
              <p className="pw-font-normal">
                {datasource?.athlete?.data[0]?.attributes?.name}
              </p>
              <h3 className="pw-font-semibold pw-mt-[2px]">Academia</h3>
              <p className="pw-font-normal">
                {
                  datasource?.athlete?.data[0]?.attributes?.academy?.data
                    ?.attributes?.name
                }
              </p>
              <h3 className="pw-font-semibold pw-mt-[2px]">
                Nome do professor
              </h3>
              <p className="pw-font-normal">
                {
                  datasource?.athlete?.data[0]?.attributes?.master?.data
                    ?.attributes?.name
                }
              </p>
              <h3 className="pw-font-semibold pw-mt-[2px]">
                Data da cerimônia
              </h3>
              <p className="pw-font-normal">{date()}</p>
              <h3 className="pw-font-semibold pw-mt-[2px]">Conquista</h3>
              <p className="pw-font-normal">{title()}</p>
            </div>
            <WeblockButton
              onClick={onContinue}
              className="pw-mt-4 pw-text-white"
              fullWidth={true}
            >
              Continuar
            </WeblockButton>
            <p className="pw-font-poppins pw-font-normal pw-text-black pw-text-xs pw-text-center pw-mt-2">
              Caso alguma informação esteja incorreta, por favor entrar em
              contato com a academia.
            </p>
          </div>
        </Box>
      }
    />
  );
};
