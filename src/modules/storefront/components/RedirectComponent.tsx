import { useEffect } from "react";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { RedirectData } from "../interfaces/Theme";

const _RedirectComponent = ({ data }: { data: RedirectData }) => {
  const {
    redirectUrl
  } = data.styleData;

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
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