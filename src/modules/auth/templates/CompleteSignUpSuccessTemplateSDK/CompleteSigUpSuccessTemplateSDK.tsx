import { ContainerControllerSDK, ExtraBy } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

interface CompleteSigUpSuccessTemplateSDKProps {
  props: AllAuthPageProps;
  extraBy?: ExtraBy[];
}

export const CompleteSigUpSuccessTemplateSDK = ({
  props,
  extraBy,
}: CompleteSigUpSuccessTemplateSDKProps) => {
  return (
    <TranslatableComponent>
      <div style={{ backgroundColor: props.bgColor }}>
        <ContainerControllerSDK
          extraBy={extraBy}
          {...props}
          separation={false}
        />
      </div>
    </TranslatableComponent>
  );
};
