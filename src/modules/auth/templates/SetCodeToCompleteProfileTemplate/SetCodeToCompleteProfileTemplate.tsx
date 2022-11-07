import { contentTypeEnum } from '../../../poll';
import {
  ContainerControllerClasses,
  ContainerControllerSDK,
  position,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { SetCodeVerify } from '../../components/SetCodeVerify';

interface SetCodeToCompleteProfileTemplateProps {
  isPostSignUp?: boolean;
  bgColor?: string;
  infoPosition?: position;
  contentType?: contentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
}

export const SetCodeToCompleteProfileTemplate = ({
  isPostSignUp,
  bgColor,
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  className,
}: SetCodeToCompleteProfileTemplateProps) => {
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: bgColor }}>
        <ContainerControllerSDK
          bgColor={bgColor}
          infoPosition={infoPosition}
          contentType={contentType}
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={logoUrl}
          textContainer={textContainer}
          className={className}
          infoComponent={
            <Box>
              <SetCodeVerify isPostSignUp={isPostSignUp} />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
