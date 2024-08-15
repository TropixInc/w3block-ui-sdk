import { Redirect } from './Redirect';

interface Params {
  widgetType?: string;
  separatorConfig: {
    showLine?: boolean;
    text?: string;
    textAbove?: boolean;
    marginTop?: string;
    marginBottom?: string;
  };
  redirectConfig: {
    text?: string;
    bgColor?: string;
    target?: string;
    textColor?: string;
    link?: string;
  };
}

export const Separator = ({
  redirectConfig,
  separatorConfig,
  widgetType,
}: Params) => {
  if (widgetType === 'redirect') return <Redirect {...redirectConfig} />;
  else
    return (
      <div
        style={{
          marginBottom: separatorConfig.marginBottom,
          marginTop: separatorConfig.marginTop,
        }}
      >
        {separatorConfig.textAbove && separatorConfig.text ? (
          <p className="pw-flex pw-gap-x-2 pw-items-center pw-text-[18px] pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold pw-mb-5">
            {separatorConfig.text}
          </p>
        ) : null}
        {separatorConfig.showLine ? (
          <span className="pw-border-black pw-block pw-border pw-border-solid pw-w-full pw-mx-auto"></span>
        ) : null}
        {!separatorConfig.textAbove && separatorConfig.text ? (
          <p className="pw-flex pw-gap-x-2 pw-items-center pw-text-[18px] pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold pw-mt-5">
            {separatorConfig.text}
          </p>
        ) : null}
      </div>
    );
};
