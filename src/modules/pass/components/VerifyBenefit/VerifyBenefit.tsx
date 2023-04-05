/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use';

import { CloseButton } from '../../../shared/components/CloseButton'
import { Spinner } from '../../../shared/components/Spinner';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Button } from '../../../tokens/components/Button';
import { TokenPassBenefitType } from '../../interfaces/PassBenefitDTO';

interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  useBenefit(): void;
  data: any;
  isLoading: boolean;
  isLoadingInfo: boolean;
}

export const VerifyBenefit = ({
  hasOpen,
  onClose,
  useBenefit,
  isLoading,
  isLoadingInfo,
  data,
}: iProps) => {
  useLockBodyScroll(hasOpen);
  const [translate] = useTranslation();

  if (hasOpen) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8">
        {(isLoading || isLoadingInfo) ?
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
            <Spinner />
          </div> :
          <>
            <CloseButton onClose={onClose} />
            <div className="pw-w-full pw-rounded-[16px] pw-p-[24px] pw-mt-8 pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)] pw-flex pw-flex-col pw-gap-2">
              <div className="pw-px-[16px] pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                {data?.data?.tokenPass?.name}
                <p className="pw-text-[18px] pw-leading-[23px] pw-font-bold">
                  {translate('token>pass>benefit')}{' '}
                  {data?.data?.name}
                </p>
              </div>
              {data?.data?.description &&
                <>
                  <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-flex pw-gap-[10px] pw-px-[16px] pw-mt-[20px] pw-w-full pw-justify-start">
                    {translate('token>pass>description')}
                  </div>
                  <div className='pw-flex pw-px-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]'>
                    {data?.data?.description}
                  </div>
                </>
              }
              {data?.data?.rules &&
                <>
                  <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-flex pw-gap-[10px] pw-px-[16px] pw-mt-[20px] pw-w-full pw-justify-start">
                    {translate('token>pass>rules')}
                  </div>
                  <div className='pw-flex pw-px-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]'>
                    {data?.data?.rules}
                  </div>
                </>
              }
              {data?.data?.type == TokenPassBenefitType.PHYSICAL ? (
                data &&
                data?.data?.tokenPassBenefitAddresses.map((address: any) => (
                  <>
                    <div className="pw-flex pw-flex-col pw-gap-1 pw-px-[16px] pw-mt-[20px]">
                      <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                        {address?.name}
                      </div>
                      <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                        {address?.street && address?.street + ', '}
                        {address?.city && address?.city + ' - '}
                        {address?.state}
                      </div>
                    </div>
                    {address?.rules && (
                      <div className="pw-flex pw-flex-col pw-gap-1 pw-px-[16px]">
                        <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945]">
                          {translate('token>pass>rules')}
                        </div>
                        <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                          {address?.rules}
                        </div>
                      </div>
                    )}
                  </>
                ))
              ) : null}
            </div>
            <div className='pw-flex pw-flex-col'>
              <Button
                onClick={useBenefit}
              >
                Usar o Benefício
              </Button>
              <Button
                className='pw-mt-5'
                variant='secondary'
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </>
        }
      </div >
    )
  }
  return null
};
