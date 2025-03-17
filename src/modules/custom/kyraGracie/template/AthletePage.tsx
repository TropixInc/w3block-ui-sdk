/* eslint-disable i18next/no-literal-string */
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
import { groupBy } from 'lodash';

import ChevronDown from '../../../../modules/shared/assets/icons/arrowDown.svg?react';
import { Spinner } from '../../../shared/components/Spinner';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import firstDegree from '../assets/1_degree.svg';
import secondDegree from '../assets/2_degree.svg';
import thirdDegree from '../assets/3_degree.svg';
import fourthDegree from '../assets/4_degree.svg';
import blackBelt from '../assets/black_belt.png';
import blueBelt from '../assets/blue_belt.png';
import brownBelt from '../assets/brown_belt.png';
import redAndBlackBelt from '../assets/coral_belt.png';
import grayBelt from '../assets/gray_belt.png';
import grayBlackBelt from '../assets/gray_black_belt.png';
import grayWhiteBelt from '../assets/gray_white_belt.png';
import greenBelt from '../assets/green_belt.png';
import greenBlackBelt from '../assets/green_black_belt.png';
import greenWhiteBelt from '../assets/green_white_belt.png';
import orangeBelt from '../assets/orange_belt.png';
import orangeBlackBelt from '../assets/orange_black_belt.png';
import orangeWhiteBelt from '../assets/orange_white_belt.png';
import placeholderAvatar from '../assets/placeholderAvatar.png';
import purpleBelt from '../assets/purple_belt.png';
import redBelt from '../assets/red_belt.png';
import redWhiteBelt from '../assets/red_white_belt.png';
import star from '../assets/star.svg';
import whiteBelt from '../assets/white_belt.png';
import yellowBelt from '../assets/yellow_belt.png';
import yellowBlackBelt from '../assets/yellow_black_belt.png';
import yellowWhiteBelt from '../assets/yellow_white_belt.png';
import {
  AthleteInterface,
  BeltColor,
  useGetAthlete,
} from '../hooks/useGetAthlete';
import { useGetAthleteByAddress } from '../hooks/useGetAthleteByAddress';
import {
  Belt,
  BeltEnglish,
  KidsBelt,
  beltEnglishMap,
  beltMap,
  belts,
  kidsMap,
} from '../interfaces';

export const gradeMap = {
  degree_1: '1º Degree',
  degree_2: '2º Degree',
  degree_3: '3º Degree',
  degree_4: '4º Degree',
  degree_5: '5º Degree',
};

export type Grade =
  | 'degree_1'
  | 'degree_2'
  | 'degree_3'
  | 'degree_4'
  | 'degree_5';

export const AthletePage = () => {
  const { datasource, loading } = useDynamicApi();
  const [translate] = useTranslation();
  const { data, isLoading } = useGetAthlete(
    datasource?.athlete?.data[0]?.id ?? ''
  );
  const isProduction = useIsProduction();
  const titles = datasource?.athlete?.data[0]?.attributes?.titles;
  const { data: athleteData } = useGetAthleteByAddress(
    datasource?.athlete?.data[0]?.id ?? '',
    '0x30905c662ce29c4c4fc527edee57a47c808f3213',
    '1284'
  );
  const groupByBelt = groupBy(titles, 'belt');
  if (athleteData?.items?.length) {
    const certification = athleteData?.items[0]?.tokenData;
    if (groupByBelt['Vermelha']?.length) {
      groupByBelt['Vermelha']?.push({ ...certification, belt: 'Vermelha' });
    } else if (groupByBelt['Vermelha e Branca']?.length) {
      groupByBelt['Vermelha e Branca']?.push({
        ...certification,
        belt: 'Vermelha e Branca',
      });
    } else if (groupByBelt['Vermelha e Preta']?.length) {
      groupByBelt['Vermelha e Preta']?.push({
        ...certification,
        belt: 'Vermelha e Preta',
      });
    } else {
      if (groupByBelt['Preta']?.length) {
        groupByBelt['Preta']?.push({ ...certification, belt: 'Preta' });
      } else {
        const belt = { Preta: [{ ...certification, belt: 'Preta' }] };
        Object.assign(groupByBelt, belt);
      }
    }
  }
  const getBeltImage = (belt: BeltColor) => {
    switch (belt) {
      case BeltColor.WHITE:
        return whiteBelt;
      case BeltColor.GRAY_AND_WHITE:
        return grayWhiteBelt;
      case BeltColor.GRAY:
        return grayBelt;
      case BeltColor.GRAY_AND_BLACK:
        return grayBlackBelt;
      case BeltColor.YELLOW_AND_WHITE:
        return yellowWhiteBelt;
      case BeltColor.YELLOW:
        return yellowBelt;
      case BeltColor.YELLOW_AND_BLACK:
        return yellowBlackBelt;
      case BeltColor.ORANGE_AND_WHITE:
        return orangeWhiteBelt;
      case BeltColor.ORANGE:
        return orangeBelt;
      case BeltColor.ORANGE_AND_BLACK:
        return orangeBlackBelt;
      case BeltColor.GREEN_AND_WHITE:
        return greenWhiteBelt;
      case BeltColor.GREEN:
        return greenBelt;
      case BeltColor.GREEN_AND_BLACK:
        return greenBlackBelt;
      case BeltColor.BLUE:
        return blueBelt;
      case BeltColor.PURPLE:
        return purpleBelt;
      case BeltColor.BROWN:
        return brownBelt;
      case BeltColor.BLACK:
        return blackBelt;
      case BeltColor.RED_AND_BLACK:
        return redAndBlackBelt;
      case BeltColor.RED_AND_WHITE:
        return redWhiteBelt;
      case BeltColor.RED:
        return redBelt;
    }
  };

  const getDegreeImage = {
    degree_1: firstDegree,
    degree_2: secondDegree,
    degree_3: thirdDegree,
    degree_4: fourthDegree,
    degree_5: fourthDegree,
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
    } catch {
      /* empty */
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
                    : placeholderAvatar
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
                  } catch {
                    /* empty */
                  }
                  return '';
                };

                if (
                  respectiveBelt === undefined &&
                  kidsMap[belt as KidsBelt] &&
                  !groupByBelt[beltEnglishMap[belt as BeltEnglish]]
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
                              groupByBelt[beltEnglishMap[belt as BeltEnglish]]
                                ? false
                                : true
                            }
                            className={`${
                              respectiveBelt !== undefined ||
                              groupByBelt[beltEnglishMap[belt as BeltEnglish]]
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
                            {groupByBelt[
                              beltEnglishMap[belt as BeltEnglish]
                            ]?.map((res: any, index: any) => {
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
                                      (res?.academy?.data?.attributes?.name ??
                                        '')
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
                              const respectiveToken = data?.items?.find(
                                (item: any) => {
                                  if (typeof res.degree === 'string')
                                    return (
                                      item?.tokenData?.degree === res.degree &&
                                      item?.tokenData?.beltColor === belt
                                    );
                                  else
                                    return item?.tokenData?.beltColor === belt;
                                }
                              );

                              if (res?.instructorIdentification) {
                                return (
                                  <a
                                    target="_blank"
                                    href={`https://pdf.wjjc.io/certification/0x30905c662ce29c4c4fc527edee57a47c808f3213/1284/?instructorIdentification=${datasource?.athlete?.data[0]?.id}&preview`}
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
                                    respectiveToken &&
                                    (res.type === 'belt' ||
                                      res.type === 'grade')
                                      ? '_blank'
                                      : ''
                                  }`}
                                  href={
                                    respectiveToken &&
                                    (res.type === 'belt' ||
                                      res.type === 'grade')
                                      ? `https://pdf${
                                          !isProduction ? '.stg' : ''
                                        }.wjjc.io/certification/${
                                          respectiveToken?.contractAddress
                                        }/${respectiveToken?.chainId}/${
                                          respectiveToken?.tokenId
                                        }?preview`
                                      : undefined
                                  }
                                  key={index}
                                  className={`${
                                    respectiveToken &&
                                    (res.type === 'belt' ||
                                      res.type === 'grade')
                                      ? ''
                                      : 'pw-opacity-60'
                                  } pw-text-black pw-font-bold pw-text-base pw-flex sm:pw-flex-row pw-flex-col sm:pw-items-center pw-items-start pw-gap-2`}
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
                {translate('custom>athletePage>notFound')}
              </h3>
              <p className="pw-text-[14px] pw-text-slate-600 pw-text-center">
                {translate('custom>athletePage>notFoundExplain')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};
