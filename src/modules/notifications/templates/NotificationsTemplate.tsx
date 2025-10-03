import useTranslation from "../../shared/hooks/useTranslation";
import { InternalPagesLayoutBase } from "../../shared/components/InternalPagesLayoutBase";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { NotificationsWrapper } from "../components/NotificationsWrapper";
import { usePrivateRoute } from "../../shared/hooks/usePrivateRoute";

const _NotificationsTemplate = () => {
  const [translate] = useTranslation()

  return (
    <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
      <div className="pw-mt-6 pw-max-w-[460px] pw-p-5 pw-border pw-border-[#E0E0E0] pw-rounded-lg">
        <p className="pw-text-2xl pw-font-semibold">{translate('notifications>notificationsTemplate>title')}</p>
        <div>
          <NotificationsWrapper />
        </div>
      </div>
    </div>
  );
};



export const NotificationsTemplate = () => {
  const { isLoading, isAuthorized } = usePrivateRoute();

  return isLoading || !isAuthorized ? null : (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}

      >
        <_NotificationsTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
}