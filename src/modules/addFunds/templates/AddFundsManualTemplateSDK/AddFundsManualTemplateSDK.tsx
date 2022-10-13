import { CheckoutHeader } from '../../../checkout';
import { ContainerWithFAQ } from '../../../shared/components/ContainerWithFAQ';
import { AddFundsManualContainer } from '../../components/AddFundsManualContainer/AddFundsManualContainer';

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
