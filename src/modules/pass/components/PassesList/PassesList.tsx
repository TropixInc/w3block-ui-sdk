import { useState } from 'react';

import { useFlags } from 'launchdarkly-react-client-sdk';

import { InternalPagesLayoutBase, useProfile } from '../../../shared';
import { QrCodeReader } from '../../../shared/components/QrCodeReader';
import {
  QrCodeError,
  TypeError,
} from '../../../shared/components/QrCodeReader/QrCodeError';
import { QrCodeValidated } from '../../../shared/components/QrCodeReader/QrCodeValidated';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Button } from '../../../tokens/components/Button';
import { TokenListTemplateSkeleton } from '../../../tokens/components/TokensListTemplate/Skeleton';
import useGetPassByUser from '../../hooks/useGetPassByUser';
import usePostBenefitRegisterUse from '../../hooks/usePostBenefitRegisterUse';
import useVerifyBenefit from '../../hooks/useVerifyBenefit';
import { BaseTemplate } from '../BaseTemplate';
import { PassCard } from '../PassCard';
import { VerifyBenefit } from '../VerifyBenefit';

const _PassesList = () => {
  const { data, isLoading } = useGetPassByUser();
  const [translate] = useTranslation();
  const benefits = data?.data.items;
  const [qrCodeData, setQrCodeData] = useState('');
  const [showScan, setOpenScan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [errorType, setErrorType] = useState<TypeError>(TypeError.read);
  const [error, setError] = useState('');
  const [editionNumber, userId, secret, benefitId] = qrCodeData.split(';');
  const { data: verifyBenefit, isLoading: verifyLoading } = useVerifyBenefit({
    benefitId: benefitId,
    secret: secret,
    userId: userId,
    editionNumber: editionNumber,
    enabled: secret !== '',
  });

  const { mutate: registerUse, isLoading: registerLoading } =
    usePostBenefitRegisterUse();

  const verifyBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitId] = qrCodeData.split(';');
    setOpenScan(false);

    if (editionNumber && userId && secret && benefitId) {
      setQrCodeData(qrCodeData);
      setShowVerify(true);
    } else {
      setError(
        'QRCode em formato inválido. Por favor verifique se o QR Code escaneado é correspondente ao benefício que deseja utilizar.'
      );
      setShowError(true);
    }
  };

  const validateBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitId] = qrCodeData.split(';');

    registerUse(
      {
        benefitId,
        secret,
        userId,
        editionNumber,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setShowVerify(false);
          setOpenScan(false);
        },
        onError: (error) => {
          console.error('Register Use: ', error);
          if (error instanceof Error) {
            if (error?.message === 'ERR_BAD_REQUEST') {
              setErrorType(TypeError.use);
            }
          }
          setError('');
          setShowError(true);
          setShowVerify(false);
          setOpenScan(false);
        },
      }
    );
  };

  if (isLoading) return <TokenListTemplateSkeleton />;

  return (
    <BaseTemplate title="Token Pass">
      <div className="pw-flex-1 pw-flex pw-flex-col pw-justify-between pw-px-4 sm:pw-px-0">
        <Button
          className="!pw-h-[40px] !pw-mb-[20px] !pw-mt-[20px]"
          onClick={() => setOpenScan(true)}
        >
          {translate('token>pass>scanQRCode')}
        </Button>
        <ul className="pw-grid pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-x-[41px] pw-gap-y-[30px]">
          {benefits?.map((benefit) => {
            return (
              <li className="w-full" key={benefit.id}>
                <PassCard
                  id={benefit.id}
                  image={benefit.imageUrl || ''}
                  name={benefit.name}
                  tokenName={benefit.tokenName}
                  contractAddress={benefit.contractAddress}
                  chainId={`${benefit.chainId}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <>
        <QrCodeReader
          hasOpen={showScan}
          returnValue={(e) => verifyBenefitUse(e)}
          onClose={() => setOpenScan(false)}
        />
        <QrCodeValidated
          hasOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          validateAgain={() => setOpenScan(true)}
          name={verifyBenefit?.data?.name}
          type={verifyBenefit?.data?.type}
          tokenPassBenefitAddresses={
            verifyBenefit?.data.tokenPassBenefitAddresses
          }
        />
        <QrCodeError
          hasOpen={showError}
          onClose={() => setShowError(false)}
          validateAgain={() => setOpenScan(true)}
          type={errorType}
          error={error}
        />
        <VerifyBenefit
          hasOpen={showVerify}
          isLoading={registerLoading}
          isLoadingInfo={verifyLoading}
          onClose={() => setShowVerify(false)}
          useBenefit={() => validateBenefitUse(qrCodeData)}
          data={verifyBenefit}
        />
      </>
    </BaseTemplate>
  );
};

export const PassesList = () => {
  const { pass } = useFlags();
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isAdmin = Boolean(
    userRoles.find(
      (e) => e === 'admin' || e === 'superAdmin' || e === 'operator'
    )
  );
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        {pass && isAdmin && <_PassesList />}
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
