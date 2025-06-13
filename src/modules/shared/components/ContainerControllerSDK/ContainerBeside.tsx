import { JSX, ReactNode, lazy } from 'react';


import { ContainerControllerClasses } from './ContainerControllerSDK';

import { FAQ } from '../FAQ';
import { position } from '../../enums/styleConfigs';
import { ContentTypeEnum } from '../../../poll/enums/contentType';
import { FAQContextEnum } from '../../enums/FAQContext';
import { ContainerTextBeside, ContainerTextBesideProps } from '../ContainerTextBeside';

interface ContainerBesideProps {
  infoComponent: ReactNode | JSX.Element;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  separation?: boolean;
  classes?: ContainerControllerClasses;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
}

export const ContainerBeside = ({
  infoComponent,
  separation = true,
  infoPosition = position.RIGHT,
  contentType = ContentTypeEnum.FAQ,
  classes,
  FAQContext = FAQContextEnum.POST_SALE,
  logoUrl,
  textContainer,
}: ContainerBesideProps) => {
  const positionClass =
    infoPosition === position.RIGHT ? 'sm:pw-flex-row-reverse pw-flex-row' : '';
  const contentTypeComponent = () => {
    switch (contentType) {
      case ContentTypeEnum.FAQ:
        return <FAQ name={FAQContext} />;
      default:
        return <ContainerTextBeside logo={logoUrl} {...textContainer} />;
    }
  };
  return (
    <div
      className={`pw-flex pw-flex-col-reverse sm:pw-flex-row pw-gap-x-[80px] pw-justify-between pw-w-full ${positionClass}`}
    >
      <div
        className={`pw-w-[100%] lg:pw-w-[60%] pw-mt-[20px] sm:pw-mt-0 lg:flex-1 lg:w-auto lg:pl-[20px] ${classes?.infoComponentClass}`}
      >
        {infoComponent}
      </div>
      {separation ? (
        <div className="lg:pw-h-[370px] lg:pw-w-[2px] pw-w-full pw-h-[2px] pw-bg-[#DCDCDC] pw-mt-[24px] lg:pw-mt-0" />
      ) : null}

      <div
        className={`pw-flex-1 lg:w-auto lg:pr-[60px] ${classes?.besideInfoClass}`}
      >
        {contentTypeComponent()}
      </div>
    </div>
  );
};
