import { useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';

import { ReactComponent as ArrowDownIcon } from '../../shared/assets/icons/arrowDown.svg';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import useTranslation from '../../shared/hooks/useTranslation';
import { AlignmentEnum, CategoriesData } from '../interfaces';

export const Menu = (props: { data: CategoriesData }) => {
  const {
    styleData: {
      backgroundColor,
      textColor,
      categories,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hoverTextColor,
      allCategories,
      allCategoriesText,
    },
  } = props.data;

  const [translate] = useTranslation();
  const [isSeeAllMenuOpen, toggleSeeAllMenu] = useToggle(false);
  const [isByActivityMenuOpen, toggleByActivityMenu] = useToggle(false);

  const byActivityMenuRef = useRef<HTMLButtonElement>(null);
  useClickAway(byActivityMenuRef, () => toggleByActivityMenu(false));

  console.log(backgroundColor);

  return (
    <TranslatableComponent>
      <div>
        <div
          style={{
            backgroundColor: backgroundColor ? backgroundColor : '#0050FF',
            color: textColor ?? 'white',
          }}
          className="pw-w-full pw-flex pw-justify-center pw-px-5 pw-font-poppins pw-max-h-57"
        >
          <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center pw-container pw-mx-auto">
            {allCategories && (
              <button
                style={{ color: textColor }}
                className="pw-border pw-border-solid pw-border-white pw-min-w-full sm:pw-min-w-max pw-h-8 pw-bg-transparent pw-rounded-3xl pw-text-base pw-px-6 pw-py-4 pw-text-center pw-cursor-pointer pw-flex pw-justify-between pw-items-center pw-gap-2"
                onClick={() => toggleSeeAllMenu()}
              >
                {allCategoriesText ?? 'Ver todas'}
                <ArrowDownIcon style={{ fill: textColor ?? 'white' }} />
              </button>
            )}

            <div className="pw-hidden pw-overflow-x-hidden sm:pw-flex pw-w-full pw-justify-around">
              {categories?.length
                ? categories?.slice(0, 7).map((category) => {
                    return (
                      <a
                        key={category.slug}
                        className="pw-no-underline pw-font-semibold pw-px-2 pw-py-4 pw-text-sm"
                        style={{ color: textColor ?? 'white' }}
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
              style={{ color: textColor ?? 'white' }}
              onClick={() => toggleByActivityMenu()}
              className="pw-hidden sm:pw-inline-flex pw-relative pw-min-w-max pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-text-sm pw-font-semibold pw-px-4 pw-py-2.5 pw-text-center pw-items-center pw-border-none pw-cursor-pointer "
            >
              {translate('storefront>menu>dropdown>byActivity')}
              <ArrowDownIcon style={{ fill: textColor ?? 'white' }} />
              {isByActivityMenuOpen && (
                <div
                  className="pw-absolute pw-top-10 pw-z-10 pw-max-h-96 pw-overflow-auto pw-drop-shadow-2xl pw-p-4 pw-flex pw-flex-col pw-justify-between pw-w-[164px]"
                  style={{
                    backgroundColor: backgroundColor
                      ? backgroundColor
                      : '#0050FF',
                  }}
                >
                  {categories?.map((category) => {
                    return (
                      <a
                        key={category.slug}
                        className="pw-py-2 pw-text-sm"
                        style={{ color: textColor ?? 'white' }}
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
          <SeeAllMenu {...props.data} />
        ) : null}
      </div>
    </TranslatableComponent>
  );
};

const SeeAllMenu = (props: CategoriesData) => {
  const { backgroundColor, textColor, categories, alignment } = props.styleData;

  const alignmentClass = () => {
    if (alignment == AlignmentEnum.CENTER) {
      return 'pw-justify-center';
    } else if (alignment == AlignmentEnum.RIGHT) {
      return 'pw-justify-end';
    } else {
      return 'pw-justify-start';
    }
  };

  return (
    <div
      style={{
        backgroundColor: backgroundColor ? backgroundColor : '#0050FF',
        color: textColor ?? 'white',
      }}
      className="pw-w-full pw-flex pw-justify-center pw-px-5 pw-font-poppins "
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
