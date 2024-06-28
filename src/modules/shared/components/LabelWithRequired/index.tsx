import { ReactNode } from 'react';

import classNames from 'classnames';

interface Props {
  children?: ReactNode;
  required?: boolean;
  name?: string;
  haveColon?: boolean;
  classes?: {
    root?: string;
  };
}

const LabelWithRequired = ({
  children,
  required = false,
  name = '',
  classes = {},
  haveColon = true,
}: Props) => {
  return (
    <div
      className={classNames(
        classes.root || '',
        'pw-flex pw-gap-x-2 pw-items-center pw-text-[15px] pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold pw-mb-1'
      )}
    >
      <label htmlFor={name} className={classNames('block select-none')}>
        {children}
        {children && haveColon ? ':' : ''}
        {required ? '*' : null}
      </label>
    </div>
  );
};

export default LabelWithRequired;
