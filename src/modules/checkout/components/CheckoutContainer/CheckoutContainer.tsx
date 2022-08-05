import { CheckoutInfo } from '../CheckoutInfo';

export const CheckoutContainer = () => {
  return (
    <div className="pw-container pw-mx-auto pw-flex pw-w-full">
      <div className="pw-w-[60%]">
        <CheckoutInfo />
      </div>
      <div className="pw-h-[370px] pw-w-[2px] pw-bg-[#DCDCDC]"></div>
      <div className="flex-1">container 2</div>
    </div>
  );
};
