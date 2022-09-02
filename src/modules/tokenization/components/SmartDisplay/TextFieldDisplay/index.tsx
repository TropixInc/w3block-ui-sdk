import classNames from 'classnames';

export interface TextFieldDisplayClasses {
  root?: string;
  label?: string;
  value?: string;
}

interface Props {
  className?: string;
  label: string;
  value: string;
  inline?: boolean;
  classes?: TextFieldDisplayClasses;
}

const TextFieldDisplay = ({
  label,
  value,
  className = '',
  inline = false,
  classes = {},
}: Props) => {
  return (
    <div
      className={classNames(
        className,
        classes.root ?? '',
        inline ? 'pw-block' : 'pw-flex pw-flex-col pw-gap-y-2'
      )}
    >
      <h2
        className={classNames(
          'pw-font-medium pw-text-base pw-leading-[19px] pw-text-black',
          classes.label ?? '',
          inline ? 'pw-inline' : ''
        )}
      >
        {label}:
      </h2>
      <p
        className={classNames(
          'pw-font-base pw-leading-[19px] pw-text-[#676767]',
          classes.value ?? '',
          inline ? 'pw-inline pw-ml-1' : ''
        )}
      >
        {value}
      </p>
    </div>
  );
};

export default TextFieldDisplay;
