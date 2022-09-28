import Skeleton from '../../../shared/components/Skeleton/Skeleton';

export const ChipWallet = ({
  showValue,
  value,
  title,
  Icon,
}: {
  showValue: boolean;
  value: string;
  title: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) => (
  <div className="pw-w-[165px] pw-bg-[#FFFFFF] pw-p-2 pw-border-2 pw-border-[#353945] pw-rounded-[148px] pw-flex pw-justify-start pw-items-center pw-gap-[10px]">
    <div className="pw-rounded-full pw-bg-[#EFEFEF] pw-w-[30px] pw-h-[30px] pw-flex pw-justify-center pw-items-center">
      <Icon />
    </div>
    <div className="pw-w-[1px] pw-bg-[#35394C] pw-h-[32px]" />
    <div className="flex flex-col pw-items-start pw-justify-center">
      <span className="font-semibold text-[13px] leading-[13px]">{title}</span>
      <span className="font-medium text-[11px] leading-[11px]">
        {showValue ? `R$${parseFloat(value).toFixed(2)}` : '****'}
      </span>
    </div>
  </div>
);

const ChipSkeleton = () => {
  return (
    <div className="pw-w-[165px] pw-bg-[#FFFFFF] pw-p-2 pw-border-2 pw-border-[#353945] pw-rounded-[148px] pw-flex pw-justify-start pw-items-center pw-gap-[10px]">
      <Skeleton className="pw-min-h-[30px] pw-w-[30px] pw-rounded-full" />
      <div className="pw-w-[1px] pw-bg-[#35394C] pw-h-[32px]" />
      <div className="pw-flex pw-flex-col pw-items-start pw-justify-center pw-gap-1">
        <Skeleton className="pw-h-[16px] pw-w-[87px]" />
        <Skeleton className="pw-h-[10px] pw-w-[87px]" />
      </div>
    </div>
  );
};

ChipWallet.Skeleton = ChipSkeleton;
