import classNames from 'classnames';
import { PixwayButton, PixwayButtonProps } from '../../shared/components/PixwayButton';



export const AuthButton = ({
  className = '',
  children,
  ...rest
}: PixwayButtonProps) => {
  return (
    <PixwayButton
      className={classNames(
        '!pw-font-medium pw-py-[11px] !pw-text-xs !pw-leading-[18px] !pw-rounded-full !pw-shadow-[0_2px_4px_#00000042] pw-border-b pw-border-b-[#FFFFFF] pw-cursor-pointer !pw-bg-brand-primary',
        'hover:!pw-shadow-[0_2px_4px_#00000042]',
        'disabled:!pw-bg-[#CCCCCC] disabled:!pw-text-[#959595] disabled:hover:!pw-shadow-[0_2px_4px_#00000042] disabled:pw-cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {children}
    </PixwayButton>
  );
};
