import { ContainerControllerSDK } from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ResetPasswordWithoutLayout } from '../../components/ResetPasswordWithoutLayout';
import { AllAuthPageProps } from '../CompleteProfileCustomTemplate';

export const ResetPasswordTemplateSDK = (props: AllAuthPageProps) => {
  return (
    <div style={{ backgroundColor: props.bgColor }}>
      <ContainerControllerSDK
        {...props}
        infoComponent={
          <Box>
            <ResetPasswordWithoutLayout />
          </Box>
        }
      />
    </div>
  );
};
