import useTranslation from "../../shared/hooks/useTranslation";
import { InternalPagesLayoutBase } from "../../shared/components/InternalPagesLayoutBase";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { NotificationsWrapper } from "../components/NotificationsWrapper";

const _NotificationsTemplate = () => {
  const [translate] = useTranslation()

  return (
    <div className="pw-flex pw-flex-col pw-px-4 sm:pw-px-0">
      <div className="pw-mt-6">
        <p className="pw-text-xl pw-font-semibold">{translate('notifications>notificationsTemplate>title')}</p>
        <div>
          <NotificationsWrapper />
        </div>
      </div>
    </div>
  );
};



export const NotificationsTemplate = () => {

   return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_NotificationsTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
}