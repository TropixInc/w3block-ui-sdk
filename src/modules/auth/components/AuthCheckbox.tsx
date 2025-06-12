import { useRef } from 'react';
import { useController } from 'react-hook-form';
import { Trans } from 'react-i18next';


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
    <div className="pw-flex pw-items-center pw-gap-x-2  pw-text-[#353945]">
      <label htmlFor={name} className="inputContainer" id="">
        <input
          {...field}
          type="checkbox"
          onClick={() => {
            field.onChange(!field.value);
          }}
          ref={checkboxRef}
          className="checkbox"
          id={name}
        />
        <span className="checkmark"></span>
        <p className="pw-ml-8 pw-mt-[3px] pw-flex pw-gap-[3px]">
          {redirectLink ? (
            <Trans i18nKey={keyTrans}>
              <span className="pw-leading-[15.85px] pw-text-[#353945]">
                {label}
              </span>
              <a
                className="pw-leading-[15.85px] pw-underline pw-text-[#353945]"
                href={redirectLink}
                target="_blank"
                rel="noreferrer"
              >
                {linkText}
              </a>
            </Trans>
          ) : (
            <p className="pw-leading-[15.85px] pw-text-[#353945] pw-ml-8">
              {label}
            </p>
          )}
        </p>
      </label>
    </div>
  );
};
