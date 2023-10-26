import { lazy } from 'react';

const CheckoutHeader = lazy(() =>
  import('../../../checkout/components/CheckoutHeader/CheckoutHeader').then(
    (m) => ({ default: m.CheckoutHeader })
  )
);

const ContainerWithFAQ = lazy(() =>
  import('../../../shared/components/ContainerWithFAQ').then((m) => ({
    default: m.ContainerWithFAQ,
  }))
);

const AddFundsManualContainer = lazy(() =>
  import(
    '../../components/AddFundsManualContainer/AddFundsManualContainer'
  ).then((m) => ({ default: m.AddFundsManualContainer }))
);

export const AddFundsManualTemplateSDK = () => {
  return (
    <>
      <CheckoutHeader />
      <ContainerWithFAQ faqType="manual_funds">
        <AddFundsManualContainer />
      </ContainerWithFAQ>
    </>
  );
};
