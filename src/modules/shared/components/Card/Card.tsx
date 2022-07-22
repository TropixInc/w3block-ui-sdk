import useTranslation from '../../hooks/useTranslation';
import TranslatableComponent from '../TranslatableComponent';

const _Card = () => {
  const [translate] = useTranslation();
  return <div className="pw-text-lg">{translate('helloWorld')}</div>;
};

export const Card = () => {
  return (
    <TranslatableComponent>
      <_Card />
    </TranslatableComponent>
  );
};
