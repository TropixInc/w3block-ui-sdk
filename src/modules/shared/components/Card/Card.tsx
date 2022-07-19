import useTranslation from '../../hooks/useTranslation';
import TranslatableComponent from '../TranslatableComponent';

const _Card = () => {
  const [translate] = useTranslation();
  return <div>{translate('helloWorld')}</div>;
};

export const Card = () => {
  return (
    <TranslatableComponent>
      <_Card />
    </TranslatableComponent>
  );
};
