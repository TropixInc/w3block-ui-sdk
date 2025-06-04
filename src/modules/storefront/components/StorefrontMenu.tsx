import { useRef } from "react";
import { useClickAway, useToggle } from "react-use";

import ArrowDownIcon from "../../shared/assets/icons/arrowDown.svg";
import { AlignmentEnum, CategoriesData, CategoriesDataStyleData } from "../interfaces/Theme";
import { useMobilePreferenceDataWhenMobile } from "../hooks/useMergeMobileData";
import { useTranslation } from "react-i18next";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { convertSpacingToCSS } from "../../shared/utils/convertSpacingToCSS";



export const StorefrontMenu = ({ data }: { data: CategoriesData }) => {
  const { styleData, mobileStyleData, id } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    backgroundColor,
    textColor,
    categories,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hoverTextColor,
    allCategories,
    allCategoriesText,
    margin,
    padding,
  } = mergedStyleData;

  const [translate] = useTranslation();
  const [isSeeAllMenuOpen, toggleSeeAllMenu] = useToggle(false);
  const [isByActivityMenuOpen, toggleByActivityMenu] = useToggle(false);

  const byActivityMenuRef = useRef<HTMLButtonElement>(null);
  useClickAway(byActivityMenuRef, () => toggleByActivityMenu(false));

  return (
    <TranslatableComponent>
      <div
        style={{
          margin: convertSpacingToCSS(margin),
          padding: convertSpacingToCSS(padding),
        }}
        id={`sf-${id}`}
      >
        <div
          style={{
            backgroundColor: backgroundColor ? backgroundColor : "#0050FF",
            color: textColor ?? "white",
          }}
          className="pw-w-full pw-flex pw-justify-center pw-px-5 pw-max-h-57"
        >
          <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center pw-container pw-mx-auto">
            {allCategories && (
              <button
                style={{ color: textColor }}
                className="pw-border pw-border-solid pw-border-white pw-min-w-full sm:pw-min-w-max pw-h-8 pw-bg-transparent pw-rounded-3xl pw-text-base pw-px-6 pw-py-4 pw-text-center pw-cursor-pointer pw-flex pw-justify-between pw-items-center pw-gap-2"
                onClick={() => toggleSeeAllMenu()}
              >
                {allCategoriesText ?? "Ver todas"}
                <ArrowDownIcon style={{ fill: textColor ?? "white" }} />
              </button>
            )}

            <div className="pw-hidden pw-overflow-x-hidden sm:pw-flex pw-w-full pw-justify-around">
              {categories?.length
                ? categories?.slice(0, 7).map((category) => {
                    return (
                      <a
                        key={category.slug}
                        className="pw-no-underline pw-font-semibold pw-px-2 pw-py-4 pw-text-sm"
                        style={{ color: textColor ?? "white" }}
                        href={category.slug}
                      >
                        {category.name}
                      </a>
                    );
                  })
                : null}
            </div>

            <button
              ref={byActivityMenuRef}
              style={{ color: textColor ?? "white" }}
              onClick={() => toggleByActivityMenu()}
              className="pw-hidden sm:pw-inline-flex pw-relative pw-min-w-max pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-text-sm pw-font-semibold pw-px-4 pw-py-2.5 pw-text-center pw-items-center pw-border-none pw-cursor-pointer "
            >
              {translate("storefront>menu>dropdown>byActivity")}
              <ArrowDownIcon style={{ fill: textColor ?? "white" }} />
              {isByActivityMenuOpen && (
                <div
                  className="pw-absolute pw-top-10 pw-z-10 pw-max-h-96 pw-overflow-auto pw-drop-shadow-2xl pw-p-4 pw-flex pw-flex-col pw-justify-between pw-w-[164px]"
                  style={{
                    backgroundColor: backgroundColor
                      ? backgroundColor
                      : "#0050FF",
                  }}
                >
                  {categories?.map((category) => {
                    return (
                      <a
                        key={category.slug}
                        className="pw-py-2 pw-text-sm"
                        style={{ color: textColor ?? "white" }}
                        href={category.slug}
                      >
                        {category.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </button>
          </div>
        </div>

        {isSeeAllMenuOpen && allCategories ? (
          <SeeAllMenu mergedStyleData={mergedStyleData} />
        ) : null}
      </div>
    </TranslatableComponent>
  );
};

const SeeAllMenu = ({
  mergedStyleData,
}: {
  mergedStyleData: CategoriesDataStyleData;
}) => {
  const { backgroundColor, textColor, categories, alignment } = mergedStyleData;

  const alignmentClass = () => {
    if (alignment == AlignmentEnum.CENTER) {
      return "pw-justify-center";
    } else if (alignment == AlignmentEnum.RIGHT) {
      return "pw-justify-end";
    } else {
      return "pw-justify-start";
    }
  };

  return (
    <div
      style={{
        backgroundColor: backgroundColor ? backgroundColor : "#0050FF",
        color: textColor ?? "white",
      }}
      className="pw-w-full pw-flex pw-justify-center pw-px-5 "
    >
      <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center pw-container">
        <div className={`pw-flex pw-flex-wrap pw-w-full ${alignmentClass()}`}>
          {categories?.map((category) => {
            return (
              <a
                key={category.slug}
                className="pw-no-underline pw-font-semibold pw-px-2 pw-py-4 pw-min-w-max pw-text-sm"
                style={{ color: textColor }}
                href={category.slug}
              >
                {category.name}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
