/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use'; 

import { format, getDay } from 'date-fns';


import useGetPassBenefits from '../../../pass/hooks/useGetPassBenefits';
import { TokenPassBenefitType } from '../../../pass/interfaces/PassBenefitDTO';
import { ReactComponent as CheckCircledIcon } from '../../assets/icons/checkCircledOutlined.svg';
import useTranslation from '../../hooks/useTranslation';
import { shortDays } from '../../utils/shortDays';
import { Button } from '../Buttons';
import { CloseButton } from '../CloseButton';

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  tokenPassId: string;
  chainId: string;
  contractAddress: string;
  benefitId: string;
  validateAgain: () => void;
}

export const QrCodeValidated = ({
  hasOpen,
  onClose,
  chainId,
  contractAddress,
  tokenPassId,
  benefitId,
  validateAgain,
}: iProps) => {
  const [translate] = useTranslation();
  const { data: benefit } = useGetPassBenefits({
    contractAddress,
    chainId,
    tokenPassId,
  });

  const benefitData = benefit?.data?.items?.filter(({id}) => id === benefitId);

  useLockBodyScroll(hasOpen);

  const time = format(new Date(), "HH':'mm");

  const handleNext = () => {
    onClose();
    validateAgain();
  }

  return hasOpen ? (
    <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
      <CloseButton onClose={onClose} />
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
              {benefitData?.[0]?.name}
            </div>
            {benefitData?.[0]?.type == TokenPassBenefitType.PHYSICAL &&
              benefitData &&
              benefitData?.[0]?.tokenPassBenefitAddresses ? (
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                {benefitData[0].tokenPassBenefitAddresses[0]?.street}
                {', '}
                {benefitData[0].tokenPassBenefitAddresses[0]?.city}
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
          width="full"
          model="secondary"
          className='pw-mt-5'
          onClick={handleNext}
        >
          {translate('token>qrCode>validatedAgain')}
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};
