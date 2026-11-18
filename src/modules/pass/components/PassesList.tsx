/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import classNames from 'classnames';

import { BaseButton } from '../../shared/components/Buttons';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { QrCodeReader } from '../../shared/components/QrCodeReader';
import {
  QrCodeError,
  TypeError,
} from '../../shared/components/QrCodeReader/QrCodeError';
import { QrCodeValidated } from '../../shared/components/QrCodeReader/QrCodeValidated';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { UI } from '../../shared/components/ui/tokens';
import { useProfile } from '../../shared/hooks/useProfile';
import useTranslation from '../../shared/hooks/useTranslation';
import useGetPassBenefits from '../hooks/useGetPassBenefits';
import useGetPassByUser from '../hooks/useGetPassByUser';
import usePostBenefitRegisterUse from '../hooks/usePostBenefitRegisterUse';
import useVerifyBenefit from '../hooks/useVerifyBenefit';
import { BaseTemplate } from './BaseTemplate';
import { PassCard } from './PassCard';
import { VerifyBenefit } from './VerifyBenefit';

const ScanIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
    <path
      d="M3 8V5a2 2 0 0 1 2-2h3M18 3h3a2 2 0 0 1 2 2v3M23 18v3a2 2 0 0 1-2 2h-3M8 23H5a2 2 0 0 1-2-2v-3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect
      x="8"
      y="8"
      width="10"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

/**
 * Operator tool: scan the customer's benefit QR code and register the use;
 * below, the passes this operator attends. The consumer's own passes live
 * in the wallet grid, not here.
 */
const _PassesList = () => {
  const { data, isFetching, error: errorGetPass } = useGetPassByUser();
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
    isFetching: verifyLoading,
    isError: verifyError,
    error: errorVerifyBenefit,
  } = useVerifyBenefit({
    benefitId: benefitId,
    secret: secret,
    userId: userId,
    editionNumber: editionNumber,
    enabled: secret != undefined && secret != '',
  });
  const filteredPass = passes?.find(
    ({ id }) => id === verifyBenefit?.data?.tokenPassBenefit?.tokenPass?.id
  );

  const { data: benefitByPass, error: errorBenefitByPass } = useGetPassBenefits(
    {
      chainId: filteredPass?.chainId,
      contractAddress: filteredPass?.contractAddress,
    }
  );

  const benefitById = benefitByPass?.data?.items?.find(
    ({ id }) => id === benefitId
  );

  const {
    mutate: registerUse,
    isPending: registerLoading,
    error: errorPostBenefit,
  } = usePostBenefitRegisterUse();

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
      { benefitId, secret, userId, editionNumber },
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

  return (
    <BaseTemplate
      title={translate('components>menu>tokenPass')}
      subtitle={translate('token>pass>operatorSubtitle')}
    >
      <SectionCard className="pw-border pw-border-dashed pw-border-[#C5C9D1]">
        <div className="pw-flex pw-flex-col sm:pw-flex-row sm:pw-items-center pw-gap-4">
          <span className="pw-grid pw-place-items-center pw-w-14 pw-h-14 pw-rounded-xl pw-bg-[#EAF1FC] pw-text-[#2F6FD0] pw-shrink-0">
            <ScanIcon />
          </span>
          <div className="pw-flex-1 pw-min-w-0">
            <p
              className={classNames(
                'pw-text-[15px] pw-font-semibold pw-m-0',
                UI.text
              )}
            >
              {translate('token>pass>scanQRCode')}
            </p>
            <p
              className={classNames(
                'pw-text-[12.5px] pw-m-0 pw-mt-0.5',
                UI.textMuted
              )}
            >
              {translate('token>pass>scanHint')}
            </p>
          </div>
          <BaseButton onClick={() => setOpenScan(true)}>
            {translate('token>pass>scanQRCode')}
          </BaseButton>
        </div>
      </SectionCard>

      <ErrorBox customError={errorGetPass as any} />

      <SectionCard title={translate('token>pass>passesOperated')}>
        {isFetching && !data ? (
          <ul className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-4 pw-m-0 pw-p-0 pw-list-none">
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <PassCard.Skeleton />
              </li>
            ))}
          </ul>
        ) : passes.length ? (
          <ul className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 xl:pw-grid-cols-3 pw-gap-4 pw-m-0 pw-p-0 pw-list-none">
            {passes.map((pass) => (
              <li key={pass.id}>
                <PassCard
                  id={pass.id}
                  image={pass.imageUrl || ''}
                  name={pass.name}
                  tokenName={pass.tokenName}
                  contractAddress={pass.contractAddress}
                  chainId={`${pass.chainId}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            bare
            title={translate('token>pass>noPasses')}
            description={translate('token>pass>noPassesDescription')}
            className="pw-py-6"
          />
        )}
      </SectionCard>

      {errorVerifyBenefit ? (
        <ErrorBox customError={errorVerifyBenefit as any} />
      ) : (
        <>
          <QrCodeReader
            hasOpen={showScan}
            returnValue={(e) => verifyBenefitUse(e)}
            onClose={() => setOpenScan(false)}
          />
          {errorBenefitByPass ? (
            <ErrorBox customError={errorBenefitByPass} />
          ) : (
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
          )}

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
            errorUseBenefit={errorPostBenefit}
            data={verifyBenefit?.data}
            tokenPassBenefitAddresses={benefitById?.tokenPassBenefitAddresses}
          />
        </>
      )}
    </BaseTemplate>
  );
};

export const PassesList = () => {
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isAdmin = Boolean(
    userRoles.find(
      (e: string) => e === 'admin' || e === 'superAdmin' || e === 'operator'
    )
  );
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        {isAdmin && <_PassesList />}
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
