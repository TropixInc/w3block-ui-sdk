import { ContainerControllerSDK } from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { RequestPasswordChangeWithoutLayout } from '../../components/RequestPasswordChangeWithoutLayout';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const RequestChangePasswordTemplateSDK = (props: AllAuthPageProps) => {
  return (
    <div style={{ backgroundColor: props.bgColor }}>
      <ContainerControllerSDK
        {...props}
        infoComponent={
          <Box>
            <RequestPasswordChangeWithoutLayout />
          </Box>
        }
      />
    </div>
  );
};
