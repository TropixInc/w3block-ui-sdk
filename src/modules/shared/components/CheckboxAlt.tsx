import { useState } from 'react';

import classNames from 'classnames';
import { useIsMobile } from '../hooks/useIsMobile';
import useTranslation from '../hooks/useTranslation';



interface Props {
  label: string;
  id: string;
  description?: string;
  link?: string;
  onChange: () => void;
  className?: string;
  classes?: {
    root?: string;
    checkIcon?: string;
  };
}

export const CheckboxAlt = ({
  label,
  className,
  classes,
  id,
  onChange,
  description,
  link,
}: Props) => {
  const [seeMore, setSeeMore] = useState(false);
  const isMobile = useIsMobile();
  const [translate] = useTranslation();
  return (
    <div
      className={classNames(
        className,
        'pw-flex pw-flex-col pw-items-start pw-gap-3'
      )}
    >
      <label className="pw-flex pw-items-center pw-gap-2 pw-text-black pw-font-medium pw-text-sm pw-leading-4 pw-cursor-pointer pw-select-none">
        <input
          className={classNames(
            classes?.root ?? '',
            'pw-border pw-bg-white pw-border-[#94B8ED] pw-w-5 pw-h-5 pw-rounded-[4px] pw-cursor-pointer pw-flex pw-items-center pw-justify-center pw-shrink-0',
            link ? 'pw-underline' : ''
          )}
          id={id}
          name={id}
          type="checkbox"
          onChange={onChange}
        ></input>
        <a href={link} target="_blank" rel="noreferrer">
          {label}
        </a>
      </label>
      {description && description.length >= 120 ? (
        <>
          {seeMore ? (
            <div className="pw-border-gray-500 pw-border-solid pw-border pw-rounded-lg pw-p-3">
              <div
                className="pw-text-[13px] pw-text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              ></div>
              <div
                onClick={() => setSeeMore(false)}
                className="pw-flex pw-justify-center pw-h-full pw-items-end pw-cursor-pointer pw-mt-2"
              >
                <p className="pw-text-gray-500 pw-font-roboto pw-text-[13px] pw-underline">
                  {translate('shared>checkboxAlt>seeLess')}
                </p>
              </div>
            </div>
          ) : (
            <div className="pw-border-gray-500 pw-border-solid pw-border pw-rounded-lg pw-p-3">
              <div
                className="pw-text-[13px] pw-text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: isMobile
                    ? description.slice(0, 120) + '...'
                    : description.slice(0, 360) + '...',
                }}
              ></div>
              <div
                onClick={() => setSeeMore(true)}
                className="pw-w-full pw-mt-2"
              >
                <div className="pw-flex pw-justify-center pw-h-full pw-items-end pw-cursor-pointer">
                  <p className="pw-text-gray-500 pw-font-roboto pw-text-[13px] pw-underline">
                    {translate('dashboard>EventCard>seeMore')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        description && (
          <div
            className="pw-text-[13px] pw-pb-8 pw-mt-6 pw-text-black"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          ></div>
        )
      )}
    </div>
  );
};
