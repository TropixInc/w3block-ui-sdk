import { lazy } from 'react';

import { ExtraBy, position } from '../../../shared';
import { ContainerControllerClasses } from '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
const PollBox = lazy(() =>
  import('../../components/PollBox/PollBox').then((module) => ({
    default: module.PollBox,
  }))
);
import { ContentTypeEnum } from '../../enums/contentType';

const ContainerControllerSDK = lazy(() =>
  import(
    '../../../shared/components/ContainerControllerSDK/ContainerControllerSDK'
  ).then((module) => ({
    default: module.ContainerControllerSDK,
  }))
);

interface PolltemplateSDKProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  pollId?: string;
  redirectWithoutPoll?: string;
  extraBy?: ExtraBy[];
}

export const PollTemplateSDK = ({
  bgColor = 'rgba(0,0,0)',
  infoPosition = position.CENTER,
  contentType = ContentTypeEnum.TEXT_LOGO,
  FAQContext,
  separation,
  classes,
  logoUrl,
  textContainer,
  className = '',
  pollId,
  redirectWithoutPoll = PixwayAppRoutes.SIGN_IN,
  extraBy,
}: PolltemplateSDKProps) => {
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: bgColor }}>
        <ContainerControllerSDK
          className={className}
          logoUrl={logoUrl}
          FAQContext={FAQContext}
          classes={classes}
          contentType={contentType}
          bgColor={bgColor}
          infoPosition={infoPosition}
          separation={separation}
          textContainer={textContainer}
          extraBy={extraBy}
          infoComponent={
            <PollBox redirectWithoutPoll={redirectWithoutPoll} slug={pollId} />
          }
        />
      </div>
    </TranslatableComponent>
  );
};
