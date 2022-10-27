import { ContainerControllerSDK, position, PoweredBy } from '../../../shared';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const CompleteSigUpSuccessTemplateSDK = (props: AllAuthPageProps) => {
  return (
    <div style={{ backgroundColor: props.bgColor }}>
      <ContainerControllerSDK {...props} separation={false} />
      <PoweredBy
        classes={{ title: 'pw-text-white' }}
        logoColor="white"
        PwPosition={position.RIGHT}
      />
    </div>
  );
};
