import classNames from "classnames";

import PixwayIconHorizontal from "../../shared/assets/icons/weblock_logo.svg";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}

export const AuthFooter = ({ className = '' }: Props) => {
  const [translate] = useTranslation();
  return (
    <footer
      className={classNames(
        "pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-y-4",
        className
      )}
    >
      <div className="pw-flex pw-items-center">
        <p className="pw-text-[13px] pw-font-medium pw-leading-[15px] pw-text-[#35394C] pw-mr-1">
          {translate("connectTokens>connectSideNavMenu>poweredBy")}
        </p>
        <PixwayIconHorizontal className="pw-w-[90px] pw-h-[22px] pw-fill-[#35394C]" />
      </div>
    </footer>
  );
};
