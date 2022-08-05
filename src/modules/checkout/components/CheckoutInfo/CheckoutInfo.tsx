import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PriceAndGasInfo, ProductInfo } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';

export enum CheckoutStatus {
  CONFIRMATION = 'CONFIRMATION',
  FINISHED = 'FINISHED',
}

interface CheckoutInfoProps {
  checkoutStatus?: CheckoutStatus;
}

const productMock = {
  image: 'https://picsum.photos/200/300',
  id: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  name: 'tenis de jogar bola',
  price: '504.20',
};

const _CheckoutInfo = ({
  checkoutStatus = CheckoutStatus.CONFIRMATION,
}: CheckoutInfoProps) => {
  const [translate] = useTranslation();

  const UnderCreditText = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return 'Você será redirecionado para o nosso parceiro Pagar.me';
      case CheckoutStatus.FINISHED:
        return 'Estamos processando na blockchain, isso pode demorar alguns minutos!';
    }
  }, [checkoutStatus]);

  return (
    <div className="pw-w-full pw-px-[80px]">
      <p className="pw-text-[18px] pw-font-[700]">Checkout</p>
      <div className="pw-flex">
        {/* TODO - Adicionar icone do cartão  */}
        <p className="pw-mt-3 pw-font-[700] pw-text-lg pw-text-[#35394C]">
          {translate('checkout>components>checkoutInfo>payment')}
        </p>
      </div>
      <p className="pw-font-[700] pw-text-2xl">
        {translate('checkout>components>checkoutInfo>creditCard')}
      </p>
      <p className="pw-font-[600] pw-text-[#35394C] pw-text-[15px] pw-mt-3">
        {UnderCreditText}
      </p>
      <p className="pw-font-[700] pw-text-lg pw-mt-4">
        {translate('shared>product')}
      </p>
      <ProductInfo
        className="pw-mt-3"
        image={productMock.image}
        id={productMock.id}
        name={productMock.name}
        price={productMock.price}
      />
      <PriceAndGasInfo className="pw-mt-4" price="220.00" gasFee="8.98" />
    </div>
  );
};

export const CheckoutInfo = ({ checkoutStatus }: CheckoutInfoProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutInfo checkoutStatus={checkoutStatus} />
    </TranslatableComponent>
  );
};
