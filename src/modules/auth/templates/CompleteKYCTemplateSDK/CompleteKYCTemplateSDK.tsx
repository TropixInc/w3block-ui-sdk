import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

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
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { FAQContextEnum } from '../../../shared/enums/FAQContext';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
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
  defaultRedirectRoute = PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
  className,
  extraBy,
}: CompleteKYCTemplateSDKProps) => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const router = useRouterConnect();
  const { status } = usePixwaySession();
  const { data: session } = usePixwaySession();
  const [callbackUrl, setCallbackUrl] = useLocalStorage<string>(
    LocalStorageFields.AUTHENTICATION_CALLBACK,
    ''
  );

  useEffect(() => {
    if (session && profile?.data) {
      const { data: user } = profile;
      if (user.kycStatus !== KycStatus.Pending) {
        router.pushConnect(getRedirectUrl(), router.query);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router, profile]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.pushConnect(PixwayAppRoutes.SIGN_IN);
    }

    if (profile) {
      const { data: user } = profile;
      if (user.kycStatus !== KycStatus.Pending) {
        router.pushConnect(defaultRedirectRoute);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, status]);

  const checkForCallbackUrl = () => {
    if (!profile?.data.mainWallet) {
      return PixwayAppRoutes.CONNECT_EXTERNAL_WALLET;
    } else if (callbackUrl) {
      const url = callbackUrl;
      setCallbackUrl('');
      return url;
    }
  };

  const getRedirectUrl = () => checkForCallbackUrl() ?? defaultRedirectRoute;

  return isLoadingProfile ? (
    <div className="pw-w-full pw-h-screen pw-flex pw-justify-center pw-items-center">
      <Spinner />
    </div>
  ) : profile ? (
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
