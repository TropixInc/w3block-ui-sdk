import { lazy } from 'react';
import { AddFundsManualContainer } from '../components/AddFundsManualContainer';
import { CheckoutHeader } from '../../checkout/components/CheckoutHeader';
import { ContainerWithFAQ } from '../../shared/components/ContainerWithFAQ';



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
