import { useEffect } from 'react';

import { KycStatus } from '@w3block/sdk-id';

import { ContentTypeEnum } from '../../../poll';
import {
  ContainerControllerClasses,
  ContainerControllerSDK,
  ExtraBy,
  position,
  useProfile,
  useRouterConnect,
} from '../../../shared';
import { Box } from '../../../shared/components/Box/Box';
import { ContainerTextBesideProps } from '../../../shared/components/ContainerTextBeside/ContainerTextBeside';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { FormCompleteKYCWithoutLayout } from '../../components/FormCompleteKYCWithoutLayout';

interface CompleteKYCTemplateSDKProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  separation?: boolean;
  logoUrl?: string;
  textContainer?: ContainerTextBesideProps;
  className?: string;
  defaultRedirectRoute?: string;
  tenantName?: string;
  extraBy?: ExtraBy[];
  redirectLink?: string;
}

export const CompleteKYCTemplateSDK = ({
  bgColor = 'white',
  infoPosition,
  contentType,
  FAQContext,
  classes,
  separation,
  logoUrl,
  textContainer,
  defaultRedirectRoute = PixwayAppRoutes.HOME,
  className,
  extraBy,
}: CompleteKYCTemplateSDKProps) => {
  const { data: profile } = useProfile();
  const router = useRouterConnect();

  useEffect(() => {
    if (profile) {
      if (profile.data.kycStatus !== KycStatus.Pending) {
        router.pushConnect(defaultRedirectRoute);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  return profile ? (
    <TranslatableComponent>
      <div style={{ backgroundColor: bgColor }}>
        <ContainerControllerSDK
          infoPosition={infoPosition}
          contentType={contentType}
          FAQContext={FAQContext}
          classes={classes}
          separation={separation}
          logoUrl={logoUrl}
          textContainer={textContainer}
          className={className}
          bgColor={bgColor}
          extraBy={extraBy}
          infoComponent={
            <Box>
              <FormCompleteKYCWithoutLayout userId={profile?.data?.id} />
            </Box>
          }
        />
      </div>
    </TranslatableComponent>
  ) : null;
};
