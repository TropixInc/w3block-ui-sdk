import { Spinner } from '../../../shared/components/Spinner';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ErrorMessage } from '../ErrorMessage';

interface FreeOrderViewProps {
  requestError?: string;
}

export const FreeOrderView = ({ requestError }: FreeOrderViewProps) => {
  const [translate] = useTranslation();

  if (requestError) {
    return (
      <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
        <ErrorMessage
          title={requestError}
          message={translate('checkout>checkoutInfo>errorContactSuport')}
        />
      </div>
    );
  }

  return (
    <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10">
      <Spinner className="pw-h-13 pw-w-13" />
      <h1 className="pw-text-2xl pw-text-black pw-mt-4">
        {translate('checkout>checkoutPayment>finalizingOrder')}
      </h1>
    </div>
  );
};
