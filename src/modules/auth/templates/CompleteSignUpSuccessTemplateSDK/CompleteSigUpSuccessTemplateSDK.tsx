import { ContainerControllerSDK, ExtraBy } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const CompleteSigUpSuccessTemplateSDK = (
  props: AllAuthPageProps,
  extraBy?: ExtraBy[]
) => {
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
