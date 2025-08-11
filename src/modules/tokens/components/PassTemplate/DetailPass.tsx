import { useToggle } from 'react-use';

import classNames from 'classnames';

import ChevronDown from '../../../shared/assets/icons/chevronDownOutlined.svg';

export const DetailPass = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [isOpen, toggleOpen] = useToggle(true);
  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-start pw-rounded-[16px] pw-border pw-border-[#EFEFEF] ">
      <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-flex pw-gap-[10px] pw-p-[16px] pw-border-b pw-border-[#EFEFEF] pw-w-full pw-justify-start">
        {title}
      </div>
      <div
        className={classNames(
          isOpen ? 'pw-flex' : 'pw-hidden',
          'pw-p-[16px] pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px]'
        )}
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      ></div>
      <div className={'pw-cursor-pointer sm:pw-hidden'} onClick={toggleOpen}>
        <ChevronDown
          className={classNames(
            'pw-stroke-[#295BA6]',
            isOpen ? 'pw-rotate-180' : ''
          )}
        />
      </div>
    </div>
  );
};
