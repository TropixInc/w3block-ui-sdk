import { format } from 'date-fns';

export const InactiveDateUseToken = ({
  eventDate,
  title,
}: {
  eventDate: Date;
  title: string;
}) => {
  return (
    <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
      <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        {title}
        <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
          {format(eventDate, 'dd/MM/yyyy')}
        </span>
      </div>
    </div>
  );
};
