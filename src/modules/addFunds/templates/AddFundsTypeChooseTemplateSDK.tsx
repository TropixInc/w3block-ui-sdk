import { CheckoutHeader } from '../../checkout/components/CheckoutHeader';
import { ContainerWithFAQ } from '../../shared/components/ContainerWithFAQ';
import { AddFundsChoosePaymentContainer } from '../components/AddFundsChoosePaymentContainer';



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
