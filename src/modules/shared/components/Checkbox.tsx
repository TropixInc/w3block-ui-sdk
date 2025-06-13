import { forwardRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import classNames from 'classnames';

import CheckFilledIcon from '../assets/icons/checkOutlined.svg';

interface Props {
  name: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  classes?: {
    root?: string;
    checkIcon?: string;
  };
}

export const Checkbox = forwardRef<HTMLButtonElement, Props>(
  ({ name, onChange, className = '', classes = {} }, checkboxRef) => {
    const {
      field: { value: checked, onChange: _, ...rest },
    } = useController({ name });
    const { setValue } = useFormContext();

    const onClick = () => {
      setValue(name, !checked, { shouldValidate: true });
      onChange && onChange(!checked);
    };

    return (
      <button
        {...rest}
        ref={checkboxRef}
        className={classNames(
          className,
          classes.root ?? '',
          'pw-border pw-bg-white pw-border-[#94B8ED] pw-w-5 pw-h-5 pw-rounded-[4px] pw-cursor-pointer focus:pw-outline-1 focus:pw-outline focus:pw-outline-[#94B8ED] pw-flex pw-items-center pw-justify-center pw-shrink-0'
        )}
        role="checkbox"
        aria-checked={checked}
        onClick={onClick}
        type="button"
      >
        {checked ? (
          <CheckFilledIcon
            className={classNames(
              '!pw-stroke-black pw-w-[14px]',
              classes.checkIcon ?? ''
            )}
          />
        ) : null}
      </button>
    );
  }
);

Checkbox.displayName = 'Checkbox';
