import { useMemo } from 'react';
import { Redirect } from './Redirect';

interface Params {
  widgetType?: string;
  separatorConfig: {
    showLine?: boolean;
    text?: string;
    textAbove?: boolean;
    marginTop?: string;
    marginBottom?: string;
    fontSize?: string;
    removeMargin?: boolean;
  };
  redirectConfig: {
    text?: string;
    bgColor?: string;
    target?: string;
    textColor?: string;
    link?: string;
  };
  className?: string;
}

export const Separator = ({
  redirectConfig,
  separatorConfig,
  widgetType,
  className,
}: Params) => {
  const fontSize = useMemo(() => {
    if (separatorConfig?.fontSize === 'small') return 'pw-text-sm';
    if (separatorConfig?.fontSize === 'large') return 'pw-text-lg';
    return 'pw-text-base';
  }, [separatorConfig?.fontSize]);

  if (widgetType === 'redirect') return <Redirect {...redirectConfig} />;
  else
    return (
      <div
        style={{
          marginBottom: separatorConfig.marginBottom,
          marginTop: separatorConfig.marginTop,
        }}
        className={className}
      >
        {separatorConfig.textAbove && separatorConfig.text ? (
          <p className={`pw-flex pw-gap-x-2 pw-items-center ${fontSize} pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold ${!separatorConfig.removeMargin ? 'pw-mb-5' : ''}`}>
            {separatorConfig.text}
          </p>
        ) : null}
        {separatorConfig.showLine ? (
          <span className="pw-border-black pw-block pw-border pw-border-solid pw-w-full pw-mx-auto"></span>
        ) : null}
        {!separatorConfig.textAbove && separatorConfig.text ? (
          <p className={`pw-flex pw-gap-x-2 pw-items-center ${fontSize} pw-w-auto pw-leading-[15px] pw-text-[#353945] pw-font-semibold ${!separatorConfig.removeMargin ? 'pw-mt-5' : ''}`}>
            {separatorConfig.text}
          </p>
        ) : null}
      </div>
    );
};
