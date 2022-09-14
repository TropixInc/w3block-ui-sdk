import TranslatableComponent from '../TranslatableComponent';

const _HeaderBack = () => {
  return <div className="pw-bg-black">teste 3</div>;
};

export const HeaderBack = () => {
  return (
    <TranslatableComponent>
      <_HeaderBack />
    </TranslatableComponent>
  );
};
