import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import _ from 'lodash';

import { AuthButton } from '../../../auth/components/AuthButton';
import { useRouterConnect } from '../../../shared';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { QrCodeSection } from '../../../tokens/components/PassTemplate/QrCodeSection';
import { useGetTokenSharedCode } from '../../hooks/useGetTokenSharedCode';

const _SharedOrder = ({
  initialStep = 1,
  shareCode,
}: {
  initialStep?: number;
  shareCode?: string;
}) => {
  const router = useRouterConnect();
  const code = router.query.code ?? shareCode;
  const [translate] = useTranslation();
  const [typeCompenent, setTypeComponent] = useState(initialStep);
  const {
    data: pass,
    isLoading,
    isError,
    refetch,
  } = useGetTokenSharedCode(code as string);

  const hasExpired =
    !pass?.benefits?.[0]?.secret ||
    pass?.benefits?.[0]?.statusMessage?.includes('ended the period of use');

  const renderComponent = (type: number) => {
    if (type === 1) {
      return (
        <div className="pw-flex pw-flex-col pw-items-center">
          <p className="pw-font-bold pw-text-2xl pw-text-center">{`Olá, ${
            pass?.data?.destinationUserName ?? ''
          }`}</p>
          <p className="pw-mt-3 pw-font-semibold pw-text-base pw-text-center">
            {translate('pass>sharedOrder>yourFriendSendGift', {
              friendName: pass?.user?.name ?? pass?.user?.email ?? '',
            })}
          </p>
          <p className="pw-mt-3 pw-text-base pw-text-center">
            {pass?.data?.message ?? ''}
          </p>
          <div className="pw-w-full pw-mt-5 pw-flex pw-flex-col pw-items-center pw-border pw-border-[#E6E8EC] pw-rounded-[20px]">
            <img
              className="pw-mt-6 pw-w-[300px] pw-h-[300px] pw-object-contain pw-rounded-lg"
              src={pass?.tokenPass?.imageUrl}
              alt=""
            />
            <p className="pw-mt-3 pw-font-semibold">
              {pass?.tokenPass?.name ?? ''}
            </p>
            <p className="pw-mt-1 pw-text-[32px] pw-font-bold pw-mb-5">
              {pass?.tokenPass?.totalAmount ?? ''}
            </p>
          </div>
          <AuthButton
            onClick={() => setTypeComponent(2)}
            className="pw-mt-7 pw-w-full"
          >
            {translate('token>pass>benefits>useBenefit')}
          </AuthButton>
        </div>
      );
    } else if (type === 2) {
      return (
        <div className="pw-flex pw-flex-col pw-items-center">
          <p className="pw-font-bold pw-text-2xl">Gift card</p>
          <p className="pw-mt-2 pw-text-base pw-font-semibold pw-text-center">
            {translate('pass>sharedOrder>QRCode')}
          </p>
          <p className="pw-mt-6 pw-text-center pw-text-base">
            {translate('pass>sharedOrder>QRCodeUsage')}
          </p>
          <div className="pw-w-full pw-mt-5 pw-flex pw-flex-col pw-items-center pw-border pw-border-[#E6E8EC] pw-rounded-[20px]">
            {isLoading ? (
              <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
                <Spinner />
              </div>
            ) : (
              <QrCodeSection
                hasExpired={hasExpired}
                editionNumber={pass?.editionNumber as string}
                benefitId={pass?.benefits?.[0]?.id ?? ''}
                secret={pass?.benefits?.[0]?.secret ?? ''}
                isDynamic={pass?.benefits?.[0]?.dynamicQrCode ?? false}
                userId={pass?.user?.id}
                refetchSecret={refetch}
                size={150}
                rootClassnames="!pw-border-none"
                isRenderSecretCode={false}
              />
            )}
            {initialStep === 2 ? null : (
              <div>
                <p className="pw-mt-3 pw-text-[13px] pw-text-center">
                  {translate('pass>sharedOrder>nameUserPass')}
                </p>
                <p className="pw-text-center  pw-mb-3  pw-text-sm pw-font-semibold">
                  {pass?.data?.destinationUserName}
                </p>
              </div>
            )}
            <div>
              <p className="pw-mb-0 pw-text-[13px] pw-text-center">
                {translate('pass>sharedOrder>nameBuyer')}
              </p>
              <p className="pw-text-center pw-text-sm pw-font-semibold">
                {pass?.user?.name ?? pass?.user?.email ?? ''}
              </p>
            </div>
            <div>
              <p className="pw-mt-3 pw-mb-0 pw-text-[13px] pw-text-center">
                {translate('pass>sharedOrder>value')}
              </p>
              <p className="pw-text-center pw-text-sm pw-font-semibold pw-mb-8">
                {pass.tokenPass.totalAmount ?? ''}
              </p>
            </div>
          </div>
          {initialStep === 2 ? (
            <p className="pw-mt-2 pw-text-base pw-font-semibold pw-text-center">
              Você poderá utilizar seu benefício também através do seu perfil
            </p>
          ) : (
            <AuthButton
              variant="outlined"
              onClick={() => setTypeComponent(1)}
              className="pw-mt-7 pw-px-10 !pw-bg-white"
            >
              Fechar
            </AuthButton>
          )}
        </div>
      );
    }
  };

  return (
    <div className="pw-mt-10 pw-w-full pw-mb-8 pw-flex pw-justify-center">
      <div className="pw-mx-auto pw-w-[580px] pw-shadow-lg pw-border pw-border-[#dddddd71] pw-flex pw-justify-center pw-items-center pw-rounded-[20px] pw-p-8">
        {isLoading ? <Spinner /> : null}
        {!isLoading && !isError && pass && renderComponent(typeCompenent)}
      </div>
    </div>
  );
};

export const SharedOrder = ({
  initialStep = 1,
  shareCode,
}: {
  initialStep?: number;
  shareCode?: string;
}) => {
  return (
    <TranslatableComponent>
      <_SharedOrder initialStep={initialStep} shareCode={shareCode} />
    </TranslatableComponent>
  );
};
