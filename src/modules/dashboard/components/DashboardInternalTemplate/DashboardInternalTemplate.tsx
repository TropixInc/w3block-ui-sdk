import { useState } from 'react';

import { UserRoleEnum } from '@w3block/sdk-id';

import { InternalPagesLayoutBase, useProfile } from '../../../shared';
import { ReactComponent as CloseIcon } from '../../../shared/assets/icons/x-circle.svg';
import { Alert } from '../../../shared/components/Alert';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PrivateRouteStrategy } from '../../../shared/enums/PrivateRouteStrategy';
import { useIsProduction } from '../../../shared/hooks/useIsProduction';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { EventCard } from '../EventCard';

const _DashboardInternalTemplate = () => {
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(true);

  const [translate] = useTranslation();
  const { data: profile } = useProfile();
  const router = useRouterConnect();

  const toggleTwoFactorModal = () => {
    setShowTwoFactorModal(!showTwoFactorModal);
  };

  const handleCardRedirect = (url: string) => {
    router.pushConnect(url);
  };

  const isProduction = useIsProduction();
  const isDevelopment = !isProduction;

  const events = isDevelopment
    ? [
        {
          id: '1',
          eventTitle: 'Evento essa semana',
          profileTitle: 'Meu perfil',
          eventDescription:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a turpis lacus.',
          url: 'teste',
        },
        {
          id: '2',
          eventTitle: 'Evento essa semana',
          profileTitle: 'Meu perfil',
          eventDescription:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a turpis lacus.',
          url: 'teste',
        },
        {
          id: '3',
          eventTitle: 'Evento essa semana',
          profileTitle: 'Meu perfil',
          eventDescription:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a turpis lacus.',
          url: 'teste',
        },
        {
          id: '4',
          eventTitle: 'Evento essa semana',
          profileTitle: 'Meu perfil',
          eventDescription:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a turpis lacus.',
          url: 'teste',
        },
        {
          id: '5',
          eventTitle: 'Evento essa semana',
          profileTitle: 'Meu perfil',
          eventDescription:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a turpis lacus.',
          url: 'teste',
        },
      ]
    : null;

  return (
    <div className="pw-p-6">
      {showTwoFactorModal && (
        <Alert className="pw-bg-[#E5EDF9]">
          <div className="pw-flex pw-justify-start pw-gap-3">
            <Alert.Icon className="pw-w-[24px] pw-h-[24px]" />
            <div>
              <p className="pw-font-poppins pw-font-semibold pw-text-[15px]">
                {translate('dashboard>dashboardInternalTemplate>twoFactorAuth')}
              </p>
              <p className="pw-font-poppins pw-font-normal pw-text-[#383857] pw-text-sm">
                {translate(
                  'dashboard>dashboardInternalTemplate>twoFactorDescription'
                )}
                <a className="pw-text-[#295BA6] pw-cursor-pointer">
                  {translate(
                    'dashboard>dashboardInternalTemplate>twoFactorLink'
                  )}
                </a>
              </p>
            </div>
            <CloseIcon
              className="pw-stroke-[#295BA6] pw-cursor-pointer"
              height={26}
              width={26}
              onClick={toggleTwoFactorModal}
            />
          </div>
        </Alert>
      )}
      <p className="pw-font-poppins pw-font-semibold pw-text-[23px] pw-my-8">
        {translate('dashboard>dashboardInternalTemplate>welcomeText', {
          name: profile?.data?.name,
        })}
      </p>
      <div className="pw-grid sm:pw-grid-cols-1 pw-justify-items-center lg:pw-grid-cols-3 pw-gap-13 pw-w-full">
        {isDevelopment &&
          events?.map((event) => {
            return (
              <EventCard
                key={event?.id}
                {...event}
                onClick={() => handleCardRedirect(event.url)}
              />
            );
          })}
      </div>
    </div>
  );
};

export const DashboardInternalTemplate = () => {
  const { isLoading, isAuthorized } = usePrivateRoute({
    roles: [UserRoleEnum.User],
    strategy: PrivateRouteStrategy.ALLOW_SPECIFIED_ROLES,
  });
  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_DashboardInternalTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
