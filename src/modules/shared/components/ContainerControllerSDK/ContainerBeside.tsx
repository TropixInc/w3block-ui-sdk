import { ReactNode } from 'react';

import { contentTypeEnum } from '../../../poll';
import { position } from '../../enums';
import { FAQContextEnum } from '../../enums/FAQContext';
import {
  ContainerTextBeside,
  ContainerTextBesideProps,
} from '../ContainerTextBeside/ContainerTextBeside';
import { FAQ } from '../FAQ';
import { ContainerControllerClasses } from './ContainerControllerSDK';

interface ContainerBesideProps {
  infoComponent: ReactNode | JSX.Element;
  infoPosition?: position;
  contentType?: contentTypeEnum;
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
  contentType = contentTypeEnum.FAQ,
  classes,
  FAQContext = FAQContextEnum.POST_SALE,
  logoUrl,
  textContainer,
}: ContainerBesideProps) => {
  const positionClass =
    infoPosition === position.RIGHT ? 'sm:pw-flex-row-reverse pw-flex-row' : '';
  const contentTypeComponent = () => {
    switch (contentType) {
      case contentTypeEnum.FAQ:
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
