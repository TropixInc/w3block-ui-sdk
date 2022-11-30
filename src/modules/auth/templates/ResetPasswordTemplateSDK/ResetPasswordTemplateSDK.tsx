import { ContainerControllerSDK } from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { ResetPasswordWithoutLayout } from '../../components/ResetPasswordWithoutLayout';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const ResetPasswordTemplateSDK = (props: AllAuthPageProps) => {
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: props.bgColor }}>
        <ContainerControllerSDK
          infoPosition={props.infoPosition}
          textContainer={props.textContainer}
          FAQContext={props.FAQContext}
          bgColor={props.bgColor}
          separation={props.separation}
          extraBy={props.extraBy}
          className={props.className}
          classes={props.classes}
          logoUrl={props.logoUrl}
          infoComponent={
            <Box>
              <ResetPasswordWithoutLayout />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
