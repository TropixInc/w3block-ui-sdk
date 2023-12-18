/* eslint-disable @typescript-eslint/no-explicit-any */
const Shimmer = lazy(() =>
  import('../../../shared/components/Shimmer').then((mod) => ({
    default: mod.Shimmer,
  }))
);

import { lazy } from 'react';

import { Spinner } from '../../../shared/components/Spinner';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import blackBelt from '../assets/black_belt.png';
import blueBelt from '../assets/blue_belt.png';
import brownBelt from '../assets/brown_belt.png';
import coralBelt from '../assets/coral_belt.png';
import purpleBelt from '../assets/purple_belt.png';
import redBelt from '../assets/red_belt.png';
import {
  AthleteInterface,
  BeltColor,
  useGetAthlete,
} from '../hooks/useGetAthlete';

export const AthletePage = () => {
  const { datasource, loading } = useDynamicApi();
  const { data, isLoading } = useGetAthlete(
    datasource?.athlete?.data[0]?.id ?? ''
  );

  const isProduction = useIsProduction();
  const belts = [
    BeltColor.BLUE,
    BeltColor.PURPLE,
    BeltColor.BROWN,
    BeltColor.BLACK,
    BeltColor.RED,
    BeltColor.CORAL,
  ];

  const beltMap = {
    Azul: 'Blue',
    Roxa: 'Purple',
    Marrom: 'Brown',
    Preta: 'Black',
    Vermelha: 'Red',
    Coral: 'Coral',
  };

  type Belt = 'Azul' | 'Roxa' | 'Marrom' | 'Preta' | 'Vermelha' | 'Coral';
  const getBeltImage = (belt: BeltColor) => {
    switch (belt) {
      case BeltColor.BLUE:
        return blueBelt;
      case BeltColor.PURPLE:
        return purpleBelt;
      case BeltColor.BROWN:
        return brownBelt;
      case BeltColor.BLACK:
        return blackBelt;
      case BeltColor.RED:
        return redBelt;
      case BeltColor.CORAL:
        return coralBelt;
    }
  };

  const getZIndexNumberByIndex = (index: number) => {
    switch (index) {
      case 0:
        return 6;
      case 1:
        return 5;
      case 2:
        return 4;
      case 3:
        return 3;
      case 4:
        return 2;
      case 5:
        return 1;
    }
  };

  const getPlaceholder = (): AthleteInterface => {
    return {
      athleteIdentification: 0,
      athleteName: '',
      athleteBirthdate: '',
      athleteGender: '',
      beltColor: BeltColor.BLACK,
      graduationDate: '',
      graduationAcademy: '',
      graduationTeacher: '',
      athleteNationality: '',
    };
  };

  if ((loading || isLoading) && (!datasource || !data))
    return (
      <div className="pw-w-full pw-h-[30rem]">
        <Spinner className="pw-m-auto pw-w-[40px] pw-h-[40px] pw-opacity-50 pw-mt-[20%]" />
      </div>
    );
  else
    return datasource?.athlete?.data?.length ? (
      <div
        style={{
          backgroundImage: `url('https://res.cloudinary.com/tropix/image/upload/v1686157813/assets/certificate/kyra/bg-papiro2_niym17.png')`,
          backgroundSize: '70px',
          backgroundRepeat: 'repeat',
        }}
        className="pw-bg-[#fffefb]"
      >
        <div className="pw-container pw-mx-auto">
          <div className="pw-px-4 pw-flex pw-justify-center pw-items-center pw-flex-col pw-pt-[30px] pw-pb-[60px]">
            <img
              className="pw-object-contain"
              src="https://res.cloudinary.com/tropix/image/upload/v1702925424/wwjjc/assets/logo-wjjc_puohqp.svg"
              alt="WJJC Logo"
            />
            <div className="pw-flex pw-justify-center pw-gap-4 pw-items-center">
              {!datasource ? (
                <Shimmer className="pw-min-h-[42px] pw-min-w-[200px]" />
              ) : (
                <img
                  src="https://res.cloudinary.com/tropix/image/upload/v1702925420/wwjjc/assets/header-wjjc_pu2kbn.svg"
                  className=" pw-object-contain pw-w-[600px] pw-mt-[30px]"
                ></img>
              )}
            </div>
            {!datasource ? (
              <Shimmer className="pw-min-h-[350px] pw-min-w-[350px] pw-rounded-lg pw-mt-[45px]" />
            ) : (
              <img
                className=" pw-w-full sm:pw-w-[350px] sm:pw-h-[350px] pw-rounded-lg pw-object-cover pw-object-center pw-mt-[45px]"
                src={
                  datasource?.athlete?.data[0]?.attributes?.picture?.data
                    ?.attributes?.url
                    ? 'https://strapi.w3block.io' +
                      datasource?.athlete?.data[0]?.attributes?.picture?.data
                        ?.attributes?.url
                    : data?.items[0]?.mainImage ??
                      'https://placehold.co/600x400'
                }
                alt={datasource?.athlete?.data[0]?.attributes?.name}
              />
            )}

            {!datasource ? (
              <Shimmer className="pw-min-h-[22px] pw-min-w-[200px] pw-mt-3" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[700] pw-mt-3 pw-text-[20px]">
                {datasource?.athlete?.data[0]?.attributes?.name ??
                  getPlaceholder().athleteName}
              </p>
            )}
            {!datasource ? (
              <Shimmer className="pw-min-h-[17px] pw-min-w-[150px] pw-mt-2" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
                {data?.items[0]?.tokenData?.athleteBirthdate ??
                  getPlaceholder().athleteBirthdate}
              </p>
            )}
            {!datasource ? (
              <Shimmer className="pw-min-h-[17px] pw-min-w-[130px] pw-mt-2" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
                {data?.items[0]?.tokenData?.athleteGender ??
                  getPlaceholder().athleteGender}
              </p>
            )}
            {!datasource ? (
              <Shimmer className="pw-min-h-[17px] pw-min-w-[170px] pw-mt-2" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
                {datasource?.athlete?.data[0]?.attributes?.country ??
                  getPlaceholder().athleteNationality}
              </p>
            )}
            <div className="pw-mt-[60px]">
              {belts.map((belt, index) => {
                const titlesFiltered =
                  datasource?.athlete?.data[0]?.attributes?.titles.filter(
                    (item: any) => item.type === 'belt'
                  );
                const respectiveBelt = titlesFiltered?.find(
                  (item: any) => beltMap[item?.belt as Belt] == belt
                );
                const respectiveToken = data?.items.find(
                  (item: any) => item.tokenData?.beltColor === belt
                );
                return (
                  <div
                    key={belt}
                    style={{ zIndex: getZIndexNumberByIndex(index) }}
                    className="pw-flex pw-items-start pw-gap-8 pw-relative"
                  >
                    <div className="pw-flex-1 pw-justify-end">
                      {respectiveToken != null ? (
                        <a
                          target={`${respectiveToken ? '_blank' : ''}`}
                          href={
                            respectiveToken
                              ? `https://pdf${
                                  !isProduction ? '.stg' : ''
                                }.w3block.io/certification/${
                                  respectiveToken?.contractAddress
                                }/${respectiveToken?.chainId}/${
                                  respectiveToken?.tokenId
                                }?preview`
                              : undefined
                          }
                          onClick={() => false}
                          rel="noreferrer"
                        >
                          <img
                            className=" pw-w-[150px] sm:pw-w-[200px] pw-object-contain"
                            src={getBeltImage(belt)}
                            alt={respectiveToken?.name ?? belt}
                          />
                        </a>
                      ) : (
                        <img
                          className=" pw-w-[150px] sm:pw-w-[200px] pw-object-contain"
                          src={getBeltImage(belt)}
                          alt={''}
                        />
                      )}
                    </div>

                    <div className="pw-flex pw-flex-col pw-items-center pw-justify-center">
                      <div className="pw-w-[27px] pw-h-[27px] pw-rounded-full pw-border pw-border-slate-300 pw-bg-white pw-flex pw-items-center pw-justify-center">
                        {respectiveBelt != null && (
                          <div className="pw-w-[17px] pw-h-[17px] pw-rounded-full pw-bg-[#01C458]"></div>
                        )}
                      </div>
                      {index < belts.length - 1 && (
                        <div className="pw-h-[200px] pw-w-[8px] pw-flex pw-items-center pw-justify-center pw-border pw-bg-white">
                          {!respectiveBelt?.currentBelt &&
                          respectiveBelt != null ? (
                            <div className="pw-h-[230px] pw-w-[6px] pw-rounded-full pw-bg-[#01C458]"></div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="pw-flex-1">
                      {respectiveBelt != null && (
                        <a
                          target={`${respectiveToken ? '_blank' : ''}`}
                          href={
                            respectiveToken
                              ? `https://pdf${
                                  !isProduction ? '.stg' : ''
                                }.w3block.io/certification/${
                                  respectiveToken?.contractAddress
                                }/${respectiveToken?.chainId}/${
                                  respectiveToken?.tokenId
                                }?preview`
                              : undefined
                          }
                          rel="noreferrer"
                        >
                          <p className="pw-text-[16px] pw-font-[700] pw-text-black pw-flex">
                            {respectiveBelt?.instructor?.data?.attributes
                              ?.name ??
                              respectiveToken?.tokenData?.graduationTeacher ??
                              ''}
                            {respectiveToken ? (
                              <img
                                src="https://res.cloudinary.com/tropix/image/upload/v1702925417/wwjjc/assets/badge_jqif6u.svg"
                                width={15}
                                height={15}
                                className="pw-ml-[7px]"
                              ></img>
                            ) : null}
                          </p>
                          <p className="pw-text-[14px] pw-font-[600] pw-text-black ">
                            {respectiveBelt?.academy?.data?.attributes?.name ??
                              respectiveToken?.tokenData?.graduationAcademy ??
                              ''}
                          </p>
                          <p className="pw-text-[12px] pw-font-[500] pw-text-black ">
                            {respectiveBelt?.date ??
                              respectiveToken?.tokenData?.graduationDate ??
                              ''}
                          </p>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="pw-min-w-screen pw-min-h-[80vh]">
        <div className="pw-container pw-mx-auto">
          <div className="pw-flex pw-justify-center pw-items-center pw-h-full pw-flex-col pw-min-h-[80vh] ">
            <div className="pw-max-w-[500px]">
              <h3 className="pw-text-[24px] pw-font-bold pw-text-center pw-text-slate-900">
                Opps! não foi encontrado
              </h3>
              <p className="pw-text-[14px] pw-text-slate-600 pw-text-center">
                Não conseguimos encontrar nenhum NFT relacionado ao
                identificador do atleta, verifique novamente o número. Caso o
                erro persista, entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};
