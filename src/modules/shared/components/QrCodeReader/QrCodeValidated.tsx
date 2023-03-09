/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use'; 

import classNames from 'classnames';
import { format, getDay } from 'date-fns';


import useGetPassBenefits from '../../../pass/hooks/useGetPassBenefits';
import { TokenPassBenefitType } from '../../../pass/interfaces/PassBenefitDTO';
import { ReactComponent as CheckCircledIcon } from '../../assets/icons/checkCircledOutlined.svg';
import { ReactComponent as XIcon } from '../../assets/icons/xFilled.svg';
import useTranslation from '../../hooks/useTranslation';
import { shortDays } from '../../utils/shortDays';
import { Button } from '../Buttons';

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  tokenPassId: string;
  chainId: string;
  contractAddress: string;
  validateAgain: () => void;
}

export const QrCodeValidated = ({
  hasOpen,
  onClose,
  chainId,
  contractAddress,
  tokenPassId,
  validateAgain,
}: iProps) => {
  const [translate] = useTranslation();
  const { data: benefit } = useGetPassBenefits({
    contractAddress,
    chainId,
    tokenPassId,
  });

  useLockBodyScroll(hasOpen);

  const time = `${new Date().getHours()}:${new Date().getMinutes()}`;

  const handleNext = () => {
    onClose();
    validateAgain();
  }

  return hasOpen ? (
    <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
      <button
          onClick={onClose}
          className={classNames(
            'pw-bg-white pw-rounded-full pw-shadow-[0px_0px_5px_rgba(0,0,0,0.25)] pw-w-8 pw-h-8 pw-absolute pw-right-4 pw-top-4 pw-flex pw-items-center pw-justify-center'
          )}
        >
          <XIcon className="pw-pw-fill-[#5682C3]" />
        </button>

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
              {shortDays[getDay(new Date())]}
            </div>
            <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F] pw-text-center pw-w-[50px]">
              {format(new Date(), 'dd MMM yyyy')}
            </div>
            <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945] pw-text-center">
              {format(new Date(), "HH'h'mm")}
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
          </div>
        </div>
      </div>
      <div className='pw-col'>
        <Button
          type="button"
          model="secondary"
          width="full"
          onClick={onClose}
        >
          {translate('token>pass>validatedToken>back')}
        </Button>
        <Button
          type="button"
          model="primary"
          width="full"
          className='mt-5'
          onClick={handleNext}
        >
          Validar outro QRCode
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};
