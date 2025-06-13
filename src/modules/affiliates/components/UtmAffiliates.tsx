import { useMemo } from 'react';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { ReferralWidget } from './ReferralWidget';


export const UtmAffiliates = () => {
  const { defaultTheme } = useThemeConfig();

  const isShowReferralWidget =
    defaultTheme?.configurations?.styleData?.memberGetMember?.htmlContent?.includes(
      '{referralWidget}'
    );

  const htmlContent = useMemo(() => {
    if (defaultTheme?.configurations?.styleData?.memberGetMember) {
      const html =
        defaultTheme?.configurations?.styleData?.memberGetMember?.htmlContent.split(
          '{referralWidget}'
        );

      return html;
    } else return [];
  }, [defaultTheme]);

  return (
    <section className="pw-w-full">
      {htmlContent.length && (
        <div
          className="pw-w-full"
          dangerouslySetInnerHTML={{
            __html: htmlContent[0],
          }}
        ></div>
      )}
      {isShowReferralWidget && (
        <ReferralWidget
          baseSharedPath={
            defaultTheme?.configurations?.styleData?.memberGetMember
              ?.baseSharedPath
          }
          shareMenssage={
            defaultTheme?.configurations?.styleData?.memberGetMember
              ?.sharingMessage
          }
        />
      )}

      {htmlContent.length && htmlContent.length > 1 && (
        <div
          className="pw-w-full"
          dangerouslySetInnerHTML={{
            __html: htmlContent[1],
          }}
        ></div>
      )}
    </section>
  );
};
