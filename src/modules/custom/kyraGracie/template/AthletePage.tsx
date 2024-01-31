/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const Shimmer = lazy(() =>
  import('../../../shared/components/Shimmer').then((mod) => ({
    default: mod.Shimmer,
  }))
);

import { lazy } from 'react';

import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import ChevronDown from '../../../../modules/shared/assets/icons/arrowDown.svg?react';
import { Spinner } from '../../../shared/components/Spinner';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import { createDateRange } from '../../utils/createDateRange';
import { groupByDateRange } from '../../utils/groupByDateRange';
import firstDegree from '../assets/1_degree.svg';
import secondDegree from '../assets/2_degree.svg';
import thirdDegree from '../assets/3_degree.svg';
import fourthDegree from '../assets/4_degree.svg';
import blackBelt from '../assets/black_belt.png';
import blueBelt from '../assets/blue_belt.png';
import brownBelt from '../assets/brown_belt.png';
import coralBelt from '../assets/coral_belt.png';
import orangeBelt from '../assets/orange_belt.png';
import purpleBelt from '../assets/purple_belt.png';
import redBelt from '../assets/red_belt.png';
import star from '../assets/star.svg';
import yellowBelt from '../assets/yellow_belt.png';
import {
  AthleteInterface,
  BeltColor,
  useGetAthlete,
} from '../hooks/useGetAthlete';
import { useGetAthleteByAddress } from '../hooks/useGetAthleteByAddress';
export const AthletePage = () => {
  const { datasource, loading } = useDynamicApi();
  const { data, isLoading } = useGetAthlete(
    datasource?.athlete?.data[0]?.id ?? ''
  );
  const isProduction = useIsProduction();
  const beltsData = datasource?.athlete?.data[0]?.attributes.titles.filter(
    (e: any) => e.type === 'belt'
  );
  const titles = datasource?.athlete?.data[0]?.attributes.titles;
  const { data: athleteData } = useGetAthleteByAddress(
    datasource?.athlete?.data[0]?.id ?? '',
    '0x30905c662ce29c4c4fc527edee57a47c808f3213',
    '1284'
  );
  if (athleteData?.items?.length) {
    const certification = athleteData?.items[0]?.tokenData;
    titles.push(certification);
  }
  const dates = beltsData?.map((e: any) => {
    return e?.date;
  });
  const datesRange = createDateRange(dates ?? []);
  const groupTitles = groupByDateRange(titles ?? [], datesRange ?? []);
  const belts = [
    BeltColor.ORANGE,
    BeltColor.YELLOW,
    BeltColor.BLUE,
    BeltColor.PURPLE,
    BeltColor.BROWN,
    BeltColor.BLACK,
    BeltColor.CORAL,
    BeltColor.RED,
  ];

  const beltMap = {
    Amarela: 'Yellow',
    Laranja: 'Orange',
    Azul: 'Blue',
    Roxa: 'Purple',
    Marrom: 'Brown',
    Preta: 'Black',
    Coral: 'Coral',
    Vermelha: 'Red',
  };

  const gradeMap = {
    degree_1: '1º Degree',
    degree_2: '2º Degree',
    degree_3: '3º Degree',
    degree_4: '4º Degree',
  };

  type Grade = 'degree_1' | 'degree_2' | 'degree_3' | 'degree_4';

  type Belt =
    | 'Amarela'
    | 'Laranja'
    | 'Azul'
    | 'Roxa'
    | 'Marrom'
    | 'Preta'
    | 'Coral'
    | 'Vermelha';

  const getBeltImage = (belt: BeltColor) => {
    switch (belt) {
      case BeltColor.ORANGE:
        return orangeBelt;
      case BeltColor.YELLOW:
        return yellowBelt;
      case BeltColor.BLUE:
        return blueBelt;
      case BeltColor.PURPLE:
        return purpleBelt;
      case BeltColor.BROWN:
        return brownBelt;
      case BeltColor.BLACK:
        return blackBelt;
      case BeltColor.CORAL:
        return coralBelt;
      case BeltColor.RED:
        return redBelt;
    }
  };

  const getDegreeImage = {
    degree_1: firstDegree,
    degree_2: secondDegree,
    degree_3: thirdDegree,
    degree_4: fourthDegree,
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

  const birthDate = () => {
    try {
      if (datasource?.athlete?.data[0]?.attributes?.birthdate)
        return format(
          Date.parse(
            datasource?.athlete?.data[0]?.attributes?.birthdate + 'T12:00:00'
          ),
          'P',
          { locale: ptBR }
        );
    } catch (e) {
      console.log(e);
    }
    return '';
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
          backgroundImage: `url('https://res.cloudinary.com/tropix/image/upload/v1705433628/wwjjc/assets/background-historic.png')`,
          backgroundRepeat: 'repeat',
        }}
        className="pw-bg-[#fffefb]"
      >
        <div className="pw-container pw-mx-auto">
          <div className="pw-px-4 pw-flex pw-justify-center pw-items-center pw-flex-col pw-pt-[30px] pw-pb-[60px]">
            <h2 className="pw-text-black pw-text-[32px] pw-font-semibold">
              Jiu-Jitsu Timeline
            </h2>
            {!datasource ? (
              <Shimmer className="pw-min-h-[350px] pw-min-w-[350px] pw-rounded-lg pw-mt-[45px]" />
            ) : (
              <img
                className="pw-w-[300px] pw-h-[375px]  pw-object-contain pw-object-center pw-mt-[45px]"
                src={
                  datasource?.athlete?.data[0]?.attributes?.picture?.data
                    ?.attributes?.url
                    ? 'https://strapi.w3block.io' +
                      datasource?.athlete?.data[0]?.attributes?.picture?.data
                        ?.attributes?.url
                    : data?.items[0]?.mainImage ??
                      'https://placehold.co/600x400'
                }
                alt={datasource?.athlete?.data[0]?.attributes?.name ?? ''}
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
              <Shimmer className="pw-min-h-[17px] pw-min-w-[130px] pw-mt-2" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
                {datasource?.athlete?.data[0]?.attributes?.gender ??
                  getPlaceholder().athleteGender}
              </p>
            )}
            {!datasource ? (
              <Shimmer className="pw-min-h-[17px] pw-min-w-[150px] pw-mt-2" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
                {birthDate() !== '' ? `(${birthDate()})` : ''}
              </p>
            )}
            {!datasource ? (
              <Shimmer className="pw-min-h-[17px] pw-min-w-[170px] pw-mt-2" />
            ) : (
              <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
                {datasource?.athlete?.data[0]?.attributes?.nationality ??
                  getPlaceholder().athleteNationality}
              </p>
            )}
            <div className="pw-mt-[60px] pw-max-w-[580px] pw-w-full pw-mx-auto pw-flex pw-flex-col pw-gap-2">
              {belts.map((belt, index) => {
                const titlesFiltered =
                  datasource?.athlete?.data[0]?.attributes?.titles?.filter(
                    (item: any) => item?.type === 'belt'
                  );

                const respectiveBelt = titlesFiltered?.find(
                  (item: any) => beltMap[item?.belt as Belt] == belt
                );

                const rangeTitles = groupTitles.find((res: any[]) =>
                  res.some(
                    (res) =>
                      res?.type === 'belt' && beltMap[res?.belt as Belt] == belt
                  )
                );

                const respectiveToken = data?.items?.find(
                  (item: any) => item?.tokenData?.beltColor === belt
                );

                const date = () => {
                  try {
                    if (
                      respectiveBelt?.date &&
                      respectiveBelt?.date?.includes('-01-01')
                    )
                      return respectiveBelt?.date?.slice(0, 4);
                    else if (respectiveBelt?.date)
                      return format(
                        Date.parse(respectiveBelt?.date + 'T12:00:00'),
                        'P',
                        { locale: ptBR }
                      );
                  } catch (e) {
                    console.log(e);
                  }
                  return '';
                };

                const beltWithDate = rangeTitles
                  ? rangeTitles?.some((res: any) => res.type === 'belt')
                  : false;

                if (
                  respectiveBelt === undefined &&
                  (belt === BeltColor.ORANGE || belt === BeltColor.YELLOW)
                )
                  return null;
                else
                  return (
                    <Disclosure key={index}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            disabled={
                              respectiveBelt !== undefined ||
                              (athleteData?.items?.length && belt === 'Black')
                                ? false
                                : true
                            }
                            className={`${
                              respectiveBelt !== undefined ||
                              (athleteData?.items?.length && belt === 'Black')
                                ? ''
                                : 'pw-opacity-60'
                            } pw-p-[9px_12px] !pw-bg-[#F7F7F7] pw-text-black pw-font-bold pw-text-base flex pw-w-full pw-justify-between pw-items-center`}
                          >
                            <div className="pw-flex pw-gap-2">
                              <img
                                className=" pw-w-[30px] sm:pw-w-[45px] pw-object-contain"
                                src={getBeltImage(belt)}
                                alt={''}
                              />
                              {date() !== '' ? `(${date()})` : ''}
                              <p>{belt + ' Belt'}</p>
                            </div>
                            <ChevronDown
                              className={classNames(
                                'pw-stroke-[#000000]',
                                open ? 'pw-rotate-180' : ''
                              )}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="pw-p-[12px] pw-bg-[#F7F7F7] pw-flex pw-flex-col pw-gap-5">
                            {!beltWithDate && respectiveBelt ? (
                              <a
                                target={`${
                                  respectiveToken &&
                                  respectiveBelt.type === 'belt'
                                    ? '_blank'
                                    : ''
                                }`}
                                href={
                                  respectiveToken &&
                                  respectiveBelt.type === 'belt'
                                    ? `https://pdf${
                                        !isProduction ? '.stg' : ''
                                      }.w3block.io/certification/${
                                        respectiveToken?.contractAddress
                                      }/${respectiveToken?.chainId}/${
                                        respectiveToken?.tokenId
                                      }?preview`
                                    : undefined
                                }
                                key={index}
                                className={`${
                                  respectiveToken &&
                                  respectiveBelt.type === 'belt'
                                    ? ''
                                    : 'pw-opacity-60'
                                } pw-text-black pw-font-bold pw-text-base pw-flex pw-items-center pw-gap-2`}
                              >
                                <p>
                                  {`${date() !== '' ? `(${date()})` : ''} ${
                                    belt + ' Belt'
                                  }`}
                                </p>
                              </a>
                            ) : null}
                            {(!rangeTitles ||
                              !rangeTitles?.some(
                                (res: any) => res?.instructorIdentification
                              )) &&
                            athleteData?.items?.length &&
                            belt === 'Black' ? (
                              <a
                                target="_blank"
                                href={`https://pdf.wjjc.io/certification/0x30905c662ce29c4c4fc527edee57a47c808f3213/1284/q?instructorIdentification=${datasource?.athlete?.data[0]?.id}&preview`}
                                key={index}
                                className="pw-text-black pw-font-bold pw-text-base pw-flex pw-items-center pw-gap-2"
                                rel="noreferrer"
                              >
                                <p>
                                  {`(${format(
                                    Date.parse(
                                      athleteData?.items[0]?.tokenData
                                        ?.dateOfIssue
                                    ),
                                    'P',
                                    { locale: ptBR }
                                  )})`}{' '}
                                  WJJC Certified Instructor
                                </p>
                              </a>
                            ) : null}
                            {rangeTitles?.map((res: any, index: any) => {
                              const date = () => {
                                if (res?.date && res?.date?.includes('-01-01'))
                                  return res?.date?.slice(0, 4);
                                else if (res?.date)
                                  return format(
                                    Date.parse(res?.date + 'T12:00:00'),
                                    'P',
                                    { locale: ptBR }
                                  );
                                else return '';
                              };

                              const title = () => {
                                if (res?.type === 'belt') return belt + ' Belt';
                                else if (res?.type === 'championship')
                                  return res?.tournamentName ?? '';
                                else if (res?.type === 'grade')
                                  return gradeMap[res?.degree as Grade] ?? '';
                                else return '';
                              };

                              const subtitle = () => {
                                const placement = (placement: number) => {
                                  if (placement === 1) return 'st';
                                  else if (placement === 2) return 'nd';
                                  else if (placement === 3) return 'rd';
                                  else return 'th';
                                };
                                if (
                                  res?.type === 'belt' ||
                                  res?.type === 'grade'
                                ) {
                                  if (
                                    res?.instructor?.data?.attributes?.name &&
                                    res?.academy?.data?.attributes?.name
                                  )
                                    return (
                                      res?.instructor?.data?.attributes?.name +
                                        ', ' +
                                        res?.academy?.data?.attributes?.name ??
                                      ''
                                    );
                                  else return '';
                                } else if (res?.type === 'championship')
                                  return (
                                    res?.tournamentPlacement +
                                    placement(res?.tournamentPlacement) +
                                    ' place'
                                  );
                                else return '';
                              };

                              if (res?.instructorIdentification) {
                                return (
                                  <a
                                    target="_blank"
                                    href={`https://pdf.wjjc.io/certification/0x30905c662ce29c4c4fc527edee57a47c808f3213/1284/q?instructorIdentification=${datasource?.athlete?.data[0]?.id}&preview`}
                                    key={index}
                                    className="pw-text-black pw-font-bold pw-text-base pw-flex pw-items-center pw-gap-2"
                                    rel="noreferrer"
                                  >
                                    <p>
                                      {`(${format(
                                        Date.parse(res?.dateOfIssue),
                                        'P',
                                        { locale: ptBR }
                                      )})`}{' '}
                                      WJJC Certified Instructor
                                    </p>
                                  </a>
                                );
                              }

                              return (
                                <a
                                  target={`${
                                    respectiveToken && res.type === 'belt'
                                      ? '_blank'
                                      : ''
                                  }`}
                                  href={
                                    respectiveToken && res.type === 'belt'
                                      ? `https://pdf${
                                          !isProduction ? '.stg' : ''
                                        }.w3block.io/certification/${
                                          respectiveToken?.contractAddress
                                        }/${respectiveToken?.chainId}/${
                                          respectiveToken?.tokenId
                                        }?preview`
                                      : undefined
                                  }
                                  key={index}
                                  className={`${
                                    respectiveToken && res.type === 'belt'
                                      ? ''
                                      : 'pw-opacity-60'
                                  } pw-text-black pw-font-bold pw-text-base pw-flex pw-items-center pw-gap-2`}
                                >
                                  <p>
                                    {`${
                                      date() !== '' ? `(${date()})` : ''
                                    } ${title()}`}
                                  </p>
                                  {res?.type === 'championship' && (
                                    <img src={star} width={13} height={12} />
                                  )}
                                  {res?.type === 'grade' && (
                                    <img
                                      src={getDegreeImage[res?.degree as Grade]}
                                      width={15}
                                      height={10}
                                    />
                                  )}
                                  <p className="pw-font-light pw-text-xs">
                                    {' ' + subtitle()}
                                  </p>
                                </a>
                              );
                            })}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
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
