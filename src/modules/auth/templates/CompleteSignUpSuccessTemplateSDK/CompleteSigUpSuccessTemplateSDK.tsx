import { ContainerControllerSDK } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const CompleteSigUpSuccessTemplateSDK = (props: AllAuthPageProps) => {
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: props.bgColor }}>
        <ContainerControllerSDK {...props} separation={false} />
      </div>
    </TranslatableComponent>
  );
};
