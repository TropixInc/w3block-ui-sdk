import { useEffect } from "react";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { RedirectData } from "../interfaces/Theme";
import { getSafeRedirectUrl } from "../../shared/utils/safeRedirectUrl";

const _RedirectComponent = ({ data }: { data: RedirectData }) => {
  const {
    redirectUrl,
  } = data.styleData;

  useEffect(() => {
    // Only http(s) or same-origin paths may be used as a redirect target; the
    // value comes from the tenant theme (and, in preview, from postMessage).
    const target = getSafeRedirectUrl(redirectUrl, window.location.origin);
    if (target) {
      window.location.assign(target);
    }
  }, [redirectUrl]);

  return <></>;
};

export const RedirectComponent = ({ data }: { data: RedirectData }) => {
  return (
    <TranslatableComponent>
      <_RedirectComponent data={data} />
    </TranslatableComponent>
  );
};