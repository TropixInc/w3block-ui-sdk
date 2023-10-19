import { ReactNode, lazy } from 'react';

import { ContentTypeEnum } from '../../../poll';
import { position } from '../../enums';
import { FAQContextEnum } from '../../enums/FAQContext';
const ContainerBeside = lazy(() =>
  import('./ContainerBeside').then((m) => ({ default: m.ContainerBeside }))
);
const ContainerCenter = lazy(() =>
  import('./ContainerCenter').then((m) => ({ default: m.ContainerCenter }))
);

const PoweredBy = lazy(() =>
  import('../PoweredBy').then((m) => ({ default: m.PoweredBy }))
);

import { ContainerTextBesideProps } from '../ContainerTextBeside/ContainerTextBeside';
import { ExtraBy } from '../PoweredBy';

interface ContainerControllerProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  infoComponent?: ReactNode | JSX.Element;
  className?: string;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  logoUrl?: string;
  separation?: boolean;
  textContainer?: ContainerTextBesideProps;
  fullScreen?: boolean;
  extraBy?: ExtraBy[];
}

export interface ContainerControllerClasses {
  infoComponentClass?: string;
  besideInfoClass?: string;
}

export const ContainerControllerSDK = ({
  bgColor = 'rgb(255,255,255)',
  infoPosition = position.CENTER,
  contentType = ContentTypeEnum.FAQ,
  FAQContext = FAQContextEnum.POST_SALE,
  infoComponent,
  classes,
  className = '',
  logoUrl,
  separation,
  textContainer,
  fullScreen = true,
  extraBy,
}: ContainerControllerProps) => {
  const positionClass =
    infoPosition === position.CENTER
      ? 'pw-justify-center'
      : infoPosition === position.RIGHT
      ? 'justify-right'
      : 'justify-left';

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={` ${
        fullScreen ? 'pw-w-screen pw-min-h-screen pw-pt-10' : ''
      } pw-flex pw-px-4 pw-flex-col pw-justify-center pw-items-center ${className}`}
    >
      <div
        className={`pw-container pw-mx-auto pw-w-full pw-flex pw-items-center pw-flex-1 ${positionClass}`}
      >
        {infoPosition === position.CENTER ? (
          <ContainerCenter
            className={classes?.infoComponentClass}
            infoComponent={infoComponent}
            logoUrl={logoUrl}
          />
        ) : (
          <ContainerBeside
            textContainer={textContainer}
            separation={separation}
            classes={classes}
            infoPosition={infoPosition}
            infoComponent={infoComponent}
            contentType={contentType}
            FAQContext={FAQContext}
            logoUrl={logoUrl}
          />
        )}
      </div>
      <PoweredBy
        classes={{ title: 'pw-text-white' }}
        logoColor="white"
        PwPosition={position.RIGHT}
        extraBy={extraBy}
      />
    </div>
  );
};
