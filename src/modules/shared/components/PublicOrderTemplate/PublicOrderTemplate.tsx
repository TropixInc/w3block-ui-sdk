import { QRCodeSVG } from 'qrcode.react';

import { useRouterConnect } from '../../hooks';
import { useGetPublicOrder } from '../../hooks/useGetPublicOrder/useGetPublicOrder';
import { Spinner } from '../Spinner';

export const PublicOrderTemplate = () => {
  const router = useRouterConnect();
  const { data, isLoading, isError } = useGetPublicOrder(
    router?.query?.id as string
  );

  if (isLoading)
    return (
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10 pw-h-[80vh]">
        <Spinner className="pw-h-13 pw-w-13" />
      </div>
    );
  else if (isError)
    return (
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10 pw-h-[80vh] pw-text-lg pw-font-medium">
        Não encontramos a compra {router?.query?.id}, por favor verifique o
        código ou tente novamente mais tarde.
      </div>
    );
  else
    return (
      <div className="pw-w-full pw-h-[80vh]">
        <div className="pw-rounded-xl pw-p-5 pw-border pw-border-[#DCDCDC] pw-text-black pw-text-center pw-mt-5 pw-max-w-[350px] pw-mx-auto">
          <div>
            <p className="pw-text-base pw-font-normal">Pagamento para</p>
            <p className="pw-text-base pw-font-semibold">
              {data?.data?.destinationUserName}
            </p>
          </div>
          <div className="pw-mt-5">
            <p className="pw-text-base pw-font-normal">Quem pagou</p>
            <p className="pw-text-base pw-font-semibold">
              {data?.data?.userFirstName}
            </p>
          </div>
          <div className="pw-mt-5">
            <p className="pw-text-base pw-font-normal">Valor pago</p>
            <p className="pw-text-base pw-font-semibold">
              R$
              {data?.data?.cashback?.amount}
            </p>
          </div>
          <div className="pw-mt-5">
            <p className="pw-text-base pw-font-normal">Cashback ganho</p>
            <p className="pw-text-base pw-font-semibold">
              {data?.data?.cashback?.currency?.symbol}{' '}
              {data?.data?.cashback?.cashbackAmount}
            </p>
          </div>
          <div className="pw-mt-5">
            <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
              <QRCodeSVG
                value={`${window?.location?.origin}/order/${data?.data?.deliverId}`}
                size={84}
              />
              <p className="pw-text-[20px] pw-font-semibold">
                {data?.data?.deliverId ?? ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};
