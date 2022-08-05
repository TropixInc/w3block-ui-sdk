import { HeaderBack } from '../../components/HeaderBack/HeaderBack';
import TranslatableComponent from '../../components/TranslatableComponent';

const _BuyController = () => {
  //const [translate] = useTranslation();
  return (
    <div>
      <HeaderBack />
    </div>
  );
};

export const BuyController = () => {
  return (
    <TranslatableComponent>
      <_BuyController />
    </TranslatableComponent>
  );
};
