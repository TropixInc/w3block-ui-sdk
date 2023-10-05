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
const AddFundsChoosePaymentContainer = lazy(() =>
  import('../../components/AddFundsChoosePaymentContainer').then((m) => ({
    default: m.AddFundsChoosePaymentContainer,
  }))
);

export const AddFundsTypeChooseTemplateSDK = () => {
  return (
    <>
      <CheckoutHeader />
      <ContainerWithFAQ faqType="post-sale">
        <AddFundsChoosePaymentContainer />
      </ContainerWithFAQ>
    </>
  );
};
