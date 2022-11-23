import { ContainerControllerSDK } from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { RequestPasswordChangeWithoutLayout } from '../../components/RequestPasswordChangeWithoutLayout';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const RequestChangePasswordTemplateSDK = (props: AllAuthPageProps) => {
  console.log(props);
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: props.bgColor }}>
        <ContainerControllerSDK
          fullScreen
          contentType={props.contentType}
          textContainer={props.textContainer}
          FAQContext={props.FAQContext}
          separation={props.separation}
          className={props.className}
          classes={props.classes}
          bgColor={props.bgColor}
          infoPosition={props.infoPosition}
          logoUrl={props.logoUrl}
          extraBy={props.extraBy}
          infoComponent={
            <Box>
              <RequestPasswordChangeWithoutLayout />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  );
};
