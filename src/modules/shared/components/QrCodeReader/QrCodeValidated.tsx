/* eslint-disable prettier/prettier */
import { useMemo } from 'react';
import { useLockBodyScroll } from 'react-use';

import { format, getDay } from 'date-fns';

import useGetPassBenefits from '../../../pass/hooks/useGetPassBenefits';
import { TokenPassBenefitType } from '../../../pass/interfaces/PassBenefitDTO';
import { useProfile } from '../../../shared';
import { ReactComponent as CheckCircledIcon } from '../../assets/icons/checkCircledOutlined.svg';
import { ReactComponent as InformationCircledIcon } from '../../assets/icons/informationCircled.svg';
import useRouter from '../../hooks/useRouter';
import useTranslation from '../../hooks/useTranslation';
import { shortDays } from '../../utils/shortDays';
import { Button } from '../Buttons';

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  tokenPassId: string;
  chainId: string;
  contractAddress: string;
}

export const QrCodeValidated = ({
  hasOpen,
  onClose,
  chainId,
  contractAddress,
  tokenPassId,
}: iProps) => {
  const router = useRouter();

  const { data: profile } = useProfile();
  const user = profile?.data;

  const { data: benefit } = useGetPassBenefits({
    contractAddress,
    chainId,
    tokenPassId,
  });

  const [translate] = useTranslation();

  const eventDate = useMemo(() => {
    if (benefit?.data?.items[0]?.eventEndsAt) {
      return new Date(benefit?.data?.items[0]?.eventEndsAt)
    } else if (!benefit?.data?.items[0]?.eventEndsAt && benefit?.data?.items[0]?.eventStartsAt) {
      return new Date(benefit?.data?.items[0]?.eventStartsAt)
    } else {
      return new Date()
    }
  }, [benefit?.data?.items]);

  useLockBodyScroll(hasOpen);

  const time = `${new Date().getHours()}:${new Date().getMinutes()}`;

  return hasOpen ? (
    <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
      <div
        className="pw-rounded-full pw-flex pw-justify-center pw-items-center pw-w-9 pw-h-9 pw-text-xs pw-text-[#353945] pw-border pw-border-[#777E8F] pw-absolute pw-top-4 pw-right-4 pw-cursor-pointer"
        onClick={onClose}
      >
        x
      </div>

      <div className="pw-flex pw-flex-col pw-gap-6 pw-justify-center pw-items-center">
        <CheckCircledIcon className="pw-w-[60px] pw-h-[60px] pw-stroke-[#76DE8D]" />
        <p className="pw-font-bold pw-text-[18px] pw-leading-[23px]">
          {translate('token>pass>validatedToken>qrCode')}
        </p>
      </div>

      <div className="pw-flex pw-flex-col pw-rounded-2xl pw-border pw-border-[#EFEFEF] pw-shadow-[2px_2px_10px_rgba(0, 0,0,0.08)] pw-rounded-2xl pw-w-full">
        <div className="pw-flex pw-flex-col pw-gap-1 pw-justify-center pw-items-center pw-py-4">
          <CheckCircledIcon className="pw-w-[20px] pw-stroke-[#295BA6]" />
          <p className="pw-font-normal pw-text-[14px] pw-leading-[21px]">
            {translate('token>pass>validatedToken>checkInDone', {
              time,
            })}
          </p>
        </div>

        <div className="pw-flex pw-gap-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
          <div className="pw-flex pw-flex-col pw-w-[120px] pw-justify-center pw-items-center">
            <div className="pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#295BA6] pw-text-center">
              {shortDays[getDay(eventDate)]}
            </div>
            <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F] pw-text-center pw-w-[50px]">
              {format(eventDate, 'dd MMM yyyy')}
            </div>
            <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945] pw-text-center">
              {format(eventDate, "HH'h'mm")}
            </div>
          </div>
          <div className="pw-h-[119px] sm:pw-h-[101px] pw-bg-[#DCDCDC] pw-w-[1px]" />
          <div className="pw-flex pw-flex-col pw-justify-center">
            <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
              {benefit?.data?.items[0]?.name}
            </div>
            {benefit?.data?.items[0]?.type == TokenPassBenefitType.PHYSICAL &&
              benefit?.data?.items[0] &&
              benefit?.data?.items[0]?.tokenPassBenefitAddresses ? (
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                {benefit?.data?.items[0]?.tokenPassBenefitAddresses[0]?.street}
                {', '}
                {benefit?.data?.items[0]?.tokenPassBenefitAddresses[0]?.city}
              </div>
            ) : (
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                Online
              </div>
            )}
            <div className="pw-flex pw-gap-1">
              <span className="pw-text-[14px] pw-leading-[21px] pw-font-semibold pw-text-[#353945]">
                {translate('token>pass>use')}
              </span>
              <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F]">
                {benefit?.data?.items[0]?.useLimit === 1
                  ? translate('token>pass>unique')
                  : translate('token>pass>youStillHave', {
                    quantity: benefit?.data?.items[0]?.useLimit,
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pw-border pw-border-[#EFEFEF] pw-shadow-[2px_2px_10px_rgba(0, 0,0,0.08)] pw-rounded-2xl pw-w-full">
        <div className="pw-border-y pw-border-[#EFEFEF] pw-w-full pw-py-4 pw-flex pw-gap-1 pw-justify-center pw-items-center">
          <InformationCircledIcon />
          {translate('token>pass>validatedToken>userDetails')}
        </div>
        <div className="pw-border-y pw-border-[#EFEFEF] pw-px-4 pw-py-3">
          <p className="pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
            {translate('token>pass>validatedToken>name')}
          </p>
          <p className="pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-text-[#353945]">
            {user?.name}
          </p>
        </div>

        <div className="pw-border-y pw-border-[#EFEFEF] pw-px-4 pw-py-3">
          <p className="pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
            {translate('token>pass>validatedToken>email')}
          </p>
          <p className="pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-text-[#353945]">
            {user?.email}
          </p>
        </div>
        {user?.phone ? (
          <div className="pw-border-y pw-border-[#EFEFEF] pw-px-4 pw-py-3">
            <p className="pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-[#777E8F]">
              {translate('token>pass>validatedToken>phone')}
            </p>
            <p className="pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-text-[#353945]">
              {user?.phone}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Button
        type="button"
        model="secondary"
        width="full"
        onClick={() => router.back()}
      >
        {translate('token>pass>validatedToken>back')}
      </Button>
    </div>
  ) : (
    <></>
  );
};
