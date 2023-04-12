import { useState } from 'react';

import { useFlags } from 'launchdarkly-react-client-sdk';
import validator from 'validator';

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
import useGetPassBenefits from '../../hooks/useGetPassBenefits';
import useGetPassByUser from '../../hooks/useGetPassByUser';
import usePostBenefitRegisterUse from '../../hooks/usePostBenefitRegisterUse';
import useVerifyBenefit from '../../hooks/useVerifyBenefit';
import { BaseTemplate } from '../BaseTemplate';
import { PassCard } from '../PassCard';
import { VerifyBenefit } from '../VerifyBenefit';

const _PassesList = () => {
  const { data, isLoading } = useGetPassByUser();
  const [translate] = useTranslation();
  const passes = data?.data.items;
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
    enabled: !validator.isEmpty(secret ?? ''),
  });
  const filteredPass = passes?.find(
    ({ id }) => id === verifyBenefit?.data?.tokenPassBenefit?.tokenPass?.id
  );

  const { data: benefitByPass } = useGetPassBenefits({
    chainId: filteredPass?.chainId,
    contractAddress: filteredPass?.contractAddress,
  });

  console.log(benefitByPass);

  const benefitById = benefitByPass?.data?.items?.find(
    ({ id }) => id === benefitId
  );

  const { mutate: registerUse, isLoading: registerLoading } =
    usePostBenefitRegisterUse();

  const verifyBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitId] = qrCodeData.split(';');
    setOpenScan(false);

    if (editionNumber && userId && secret && benefitId) {
      setQrCodeData(qrCodeData);
      setShowVerify(true);
    } else {
      setError(translate('token>pass>invalidFormat'));
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
          {passes?.map((passes) => {
            return (
              <li className="w-full" key={passes.id}>
                <PassCard
                  id={passes.id}
                  image={passes.imageUrl || ''}
                  name={passes.name}
                  tokenName={passes.tokenName}
                  contractAddress={passes.contractAddress}
                  chainId={`${passes.chainId}`}
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
          name={verifyBenefit?.data?.tokenPassBenefit?.name}
          type={verifyBenefit?.data?.tokenPassBenefit?.type}
          tokenPassBenefitAddresses={benefitById?.tokenPassBenefitAddresses}
          userEmail={verifyBenefit?.data?.user?.email}
          userName={verifyBenefit?.data?.user?.name}
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
          data={verifyBenefit?.data}
          tokenPassBenefitAddresses={benefitById?.tokenPassBenefitAddresses}
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
