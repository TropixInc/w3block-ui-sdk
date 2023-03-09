import { ContentTypeEnum } from '../../../poll';
import {
  ContainerControllerClasses,
  ContainerControllerSDK,
  ExtraBy,
  position,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { CompleteSignUpSuccessWithoutLayout } from '../../components/CompleteSignUpSuccessWithoutLayout';

interface CompleteSignUpSuccessTemplateSDKProps {
  extraBy?: ExtraBy[];
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
}

export const CompleteSignUpSuccessTemplateSDK = ({
  extraBy,
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  classes,
  logoUrl,
  textContainer,
  className,
}: CompleteSignUpSuccessTemplateSDKProps) => {
  return (
    <TranslatableComponent>
      <ContainerControllerSDK
        extraBy={extraBy}
        bgColor={bgColor}
        infoPosition={infoPosition}
        contentType={contentType}
        FAQContext={FAQContext}
        classes={classes}
        separation={false}
        logoUrl={logoUrl}
        textContainer={textContainer}
        className={className}
        infoComponent={
          <Box>
            <CompleteSignUpSuccessWithoutLayout />
          </Box>
        }
      />
    </TranslatableComponent>
  );
};
