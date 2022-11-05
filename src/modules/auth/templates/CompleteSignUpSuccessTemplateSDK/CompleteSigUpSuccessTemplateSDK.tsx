import { ContainerControllerSDK } from '../../../shared';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const CompleteSigUpSuccessTemplateSDK = (props: AllAuthPageProps) => {
  return (
    <div style={{ backgroundColor: props.bgColor }}>
      <ContainerControllerSDK {...props} separation={false} />
    </div>
  );
};
