/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useLockBodyScroll } from 'react-use';

import ErrorIcon from '../../../shared/assets/icons/errorIconRed.svg?react';
import { CloseButton } from '../../../shared/components/CloseButton';
import { ErrorBox } from '../../../shared/components/ErrorBox';
import { Spinner } from '../../../shared/components/Spinner';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Button } from '../../../tokens/components/Button';
import { BenefitAddress, TokenPassBenefitType } from '../../interfaces/PassBenefitDTO';


interface iProps {
  hasOpen: boolean;
  onClose: () => void;
  useBenefit(): void;
  data: any;
  isLoading: boolean;
  isLoadingInfo?: boolean;
  tokenPassBenefitAddresses?: BenefitAddress[];
  error?: boolean;
  errorUseBenefit?: any;
  user?: {
    name?: string,
    email?: string,
  }
}

export const VerifyBenefit = ({
  hasOpen,
  onClose,
  useBenefit,
  isLoading,
  isLoadingInfo,
  data,
  tokenPassBenefitAddresses,
  error,
  user,
  errorUseBenefit,
}: iProps) => {
  useLockBodyScroll(hasOpen);
  const [translate] = useTranslation();

  if (hasOpen) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-6 pw-fixed pw-top-0 pw-left-0 pw-w-full pw-h-screen pw-z-50 pw-bg-white pw-px-4 pw-py-8 pw-overflow-scroll">
        {(isLoading || isLoadingInfo) ?
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
            <Spinner />
          </div> :
          <div className='pw-max-w-[400px] pw-mx-auto pw-relative '>
            <CloseButton onClose={onClose} className='!-pw-top-[17px] !pw-right-0' />
            <div className="pw-w-full pw-rounded-[16px] pw-p-[24px] pw-mt-8 pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)] pw-flex pw-flex-col pw-gap-2">
              {error ?
                <>
                  <div className="pw-flex pw-flex-col pw-gap-6 pw-justify-center pw-items-center">
                    <ErrorIcon className="pw-w-[60px] pw-h-[60px]" />
                    <p className="pw-font-bold pw-text-[18px] pw-leading-[23px]">
                      {translate('token>pass>invalidQrCode')}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    {translate('token>pass>validatedToken>back')}
                  </Button>
                </>
                :
                <>
                  <div className="pw-px-[16px] pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                    {data?.tokenPassBenefit?.tokenPass?.name ?? data?.tokenPass?.name}
                    <p className="pw-text-[18px] pw-leading-[23px] pw-font-bold">
                      {translate('token>pass>benefit')}{' '}
                      {data?.tokenPassBenefit?.name ?? data?.name}
                    </p>
                  </div>
                  <ErrorBox customError={errorUseBenefit} />
                  <div className='pw-flex pw-flex-col'>
                    <Button
                      className='pw-mt-5'
                      onClick={useBenefit}
                    >
                      {translate('pass>verifyBenefit>confirmUsage')}
                    </Button>
                    <Button
                      className='pw-mt-5'
                      variant='secondary'
                      onClick={onClose}
                    >
                      {translate('token>pass>cancel')}
                    </Button>
                  </div>
                  {(data?.tokenPassBenefit?.description ?? data?.description) &&
                    <>
                      <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-flex pw-gap-[10px] pw-px-[16px] pw-mt-[20px] pw-w-full pw-justify-start">
                        {translate('token>pass>description')}
                      </div>
                      <div className='pw-flex pw-px-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]' dangerouslySetInnerHTML={{ __html: data?.tokenPassBenefit?.description ?? data?.description }}>
                      </div>
                    </>
                  }
                  {(data?.tokenPassBenefit?.rules ?? data?.rules) &&
                    <>
                      <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-flex pw-gap-[10px] pw-px-[16px] pw-mt-[20px] pw-w-full pw-justify-start">
                        {translate('token>pass>rules')}
                      </div>
                      <div className='pw-flex pw-px-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]' dangerouslySetInnerHTML={{ __html: data?.tokenPassBenefit?.rules ?? data?.rules }}>
                      </div>
                    </>
                  }
                  <>
                    <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-flex pw-gap-[10px] pw-px-[16px] pw-mt-[20px] pw-w-full pw-justify-start">
                      {translate('token>pass>user')}
                    </div>
                    <div className='pw-flex pw-px-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]'>
                      Username: {data?.user?.name ?? user?.name}
                    </div>
                    <div className='pw-flex pw-px-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]'>
                      E-mail: {data?.user?.email ?? user?.email}
                    </div>
                  </>
                  {(data?.tokenPassBenefit?.type ?? data?.type) == TokenPassBenefitType.PHYSICAL ? (
                    tokenPassBenefitAddresses?.length &&
                    tokenPassBenefitAddresses.map((address: any) => (
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
                </>
              }
            </div>
          </div>
        }
      </div >
    )
  }
  return null
};
