import { lazy, useState } from 'react';

import { useFlags } from 'launchdarkly-react-client-sdk';

import { InternalPagesLayoutBase, useProfile } from '../../../shared';
//import { QrCodeReader } from '../../../shared/components/QrCodeReader';
const QrCodeReader = lazy(() =>
  import('../../../shared/components/QrCodeReader').then((module) => ({
    default: module.QrCodeReader,
  }))
);
const QrCodeError = lazy(() =>
  import('../../../shared/components/QrCodeReader/QrCodeError').then(
    (module) => ({
      default: module.QrCodeError,
    })
  )
);
const QrCodeValidated = lazy(() =>
  import('../../../shared/components/QrCodeReader/QrCodeValidated').then(
    (module) => ({ default: module.QrCodeValidated })
  )
);
const TokenListTemplateSkeleton = lazy(() =>
  import('../../../tokens/components/TokensListTemplate/Skeleton').then(
    (module) => ({
      default: module.TokenListTemplateSkeleton,
    })
  )
);
const Button = lazy(() =>
  import('../../../tokens/components/Button').then((module) => ({
    default: module.Button,
  }))
);
const BaseTemplate = lazy(() =>
  import('../BaseTemplate').then((module) => ({ default: module.BaseTemplate }))
);
const VerifyBenefit = lazy(() =>
  import('../VerifyBenefit').then((module) => ({
    default: module.VerifyBenefit,
  }))
);
const PassCard = lazy(() =>
  import('../PassCard').then((module) => ({
    default: module.PassCard,
  }))
);
import { TypeError } from '../../../shared/components/QrCodeReader/QrCodeError';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useTranslation from '../../../shared/hooks/useTranslation';
import useGetPassBenefitById from '../../hooks/useGetPassBenefitById';
import useGetPassByUser from '../../hooks/useGetPassByUser';
import usePostBenefitRegisterUse from '../../hooks/usePostBenefitRegisterUse';
import useVerifyBenefit from '../../hooks/useVerifyBenefit';

const _PassesList = () => {
  const { data, isLoading } = useGetPassByUser();
  const [translate] = useTranslation();
  const passes = data?.data?.items || [];
  const [qrCodeData, setQrCodeData] = useState('');
  const [showScan, setOpenScan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [errorType, setErrorType] = useState<TypeError>(TypeError.read);
  const [error, setError] = useState('');
  const [editionNumber, userId, secret, benefitId] = qrCodeData.split(',');
  const {
    data: verifyBenefit,
    isLoading: verifyLoading,
    isError: verifyError,
  } = useVerifyBenefit({
    benefitId: benefitId,
    secret: secret,
    userId: userId,
    editionNumber: editionNumber,
    enabled: secret != undefined && secret != '',
  });

  const { data: benefitById } = useGetPassBenefitById(benefitId);

  const { mutate: registerUse, isLoading: registerLoading } =
    usePostBenefitRegisterUse();

  const verifyBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitId] = qrCodeData.split(',');
    setOpenScan(false);
    if (verifyError) {
      setError(translate('token>pass>invalidFormat'));
      setShowError(true);
    } else if (editionNumber && userId && secret && benefitId) {
      setQrCodeData(qrCodeData);
      setShowVerify(true);
    } else {
      setError(translate('token>pass>invalidFormat'));
      setShowError(true);
    }
  };

  const validateBenefitUse = (qrCodeData: string) => {
    const [editionNumber, userId, secret, benefitId] = qrCodeData.split(',');

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
          tokenPassBenefitAddresses={
            benefitById?.data?.tokenPassBenefitAddresses
          }
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
          error={verifyError}
          isLoading={registerLoading}
          isLoadingInfo={verifyLoading}
          onClose={() => setShowVerify(false)}
          useBenefit={() => validateBenefitUse(qrCodeData)}
          data={verifyBenefit?.data}
          tokenPassBenefitAddresses={
            benefitById?.data?.tokenPassBenefitAddresses
          }
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
