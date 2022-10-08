import { InternalPagesLayoutBase, useProfile } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useTranslation from '../../../shared/hooks/useTranslation';
import { EventCard } from '../EventCard';

const _DashboardInternalTemplate = () => {
  const [translate] = useTranslation();
  const { data: profile } = useProfile();

  const events = [
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
  ];
  return (
    <div className="pw-p-6">
      <Alert>
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
                {translate('dashboard>dashboardInternalTemplate>twoFactorLink')}
              </a>
            </p>
          </div>
        </div>
      </Alert>
      <p className="pw-font-poppins pw-font-semibold pw-text-[23px] pw-my-8">
        {translate('dashboard>dashboardInternalTemplate>welcomeText', {
          name: profile?.data?.name,
        })}
      </p>
      <div className="pw-grid sm:pw-grid-cols-1 pw-justify-items-center lg:pw-grid-cols-3 pw-gap-13 pw-w-full">
        {events.map((event) => {
          return <EventCard key={event?.id} {...event} />;
        })}
      </div>
    </div>
  );
};

export const DashboardInternalTemplate = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_DashboardInternalTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
