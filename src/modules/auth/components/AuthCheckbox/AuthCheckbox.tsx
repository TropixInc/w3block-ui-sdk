import { useRef } from 'react';
import { useController } from 'react-hook-form';
import { Trans } from 'react-i18next';

import classNames from 'classnames';

import { ReactComponent as CheckboxOutlined } from '../../assets/icons/checkboxOutlined.svg';

interface Props {
  name: string;
  label: string;
  redirectLink?: string;
  keyTrans: string;
  linkText: string;
}

export const AuthCheckbox = ({
  name,
  label,
  redirectLink,
  keyTrans,
  linkText,
}: Props) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { field } = useController({ name });
  return (
    <div className="pw-flex pw-items-center pw-gap-x-2 pw-cursor-pointer">
      <input
        type="checkbox"
        {...field}
        ref={checkboxRef}
        className="pw-hidden"
      />
      <span
        onClick={() => checkboxRef.current?.click()}
        className={classNames(
          field.value
            ? 'pw-hidden'
            : 'pw-w-[12.75px] pw-h-[12.75px] pw-border pw-border-brand-primary pw-rounded-sm'
        )}
      />
      <CheckboxOutlined
        onClick={() => checkboxRef.current?.click()}
        className={classNames(
          !field.value
            ? 'pw-hidden'
            : 'pw-w-[12.75px] pw-h-[12.75px] pw-stroke-[#76DE8D]'
        )}
      />
      {redirectLink ? (
        <Trans i18nKey={keyTrans}>
          <p className="text-[13px] leading-[15.85px]">{label}</p>
          <a
            className="pw-text-[13px] pw-leading-[15.85px] pw-underline"
            href={redirectLink}
            target="_blank"
            rel="noreferrer"
          >
            {linkText}
          </a>
        </Trans>
      ) : (
        <label
          className="pw-text-[13px] pw-leading-[15.85px]"
          onClick={() => checkboxRef.current?.click()}
        >
          {label}
        </label>
      )}
    </div>
  );
};
