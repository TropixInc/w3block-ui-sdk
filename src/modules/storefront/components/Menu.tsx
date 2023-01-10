import { useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';

import { ReactComponent as ArrowDownIcon } from '../../shared/assets/icons/arrowDown.svg';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import useTranslation from '../../shared/hooks/useTranslation';

export const Menu = (props: { data: MenuProps }) => {
  const { bgColor, textColor, categories } = props.data;

  const [translate] = useTranslation();
  const [isSeeAllMenuOpen, toggleSeeAllMenu] = useToggle(false);
  const [isByActivityMenuOpen, toggleByActivityMenu] = useToggle(false);

  const byActivityMenuRef = useRef<HTMLButtonElement>(null);
  useClickAway(byActivityMenuRef, () => toggleByActivityMenu(false));

  return (
    <TranslatableComponent>
      <div>
        <div
          style={{ backgroundColor: bgColor, color: textColor }}
          className="pw-w-full pw-flex pw-justify-center pw-px-5 pw-font-poppins pw-max-h-57"
        >
          <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center pw-container">
            <button
              style={{ color: textColor }}
              className="pw-border pw-border-solid pw-border-white pw-min-w-full sm:pw-min-w-max pw-h-8 pw-bg-transparent pw-rounded-3xl pw-text-base pw-px-6 pw-py-4 pw-text-center pw-cursor-pointer pw-flex pw-justify-center pw-items-center pw-gap-2"
              onClick={() => toggleSeeAllMenu()}
            >
              {translate('storefront>menu>dropdown>seeAll')}
              <ArrowDownIcon style={{ fill: textColor }} />
            </button>

            <div className="pw-hidden lg:pw-flex pw-w-full pw-justify-around">
              {categories?.slice(0, 9).map((category) => {
                return (
                  <a
                    key={category.slug}
                    className="pw-no-underline pw-font-semibold pw-px-2 pw-py-4"
                    style={{ color: textColor }}
                    href={category.slug}
                  >
                    {category.label}
                  </a>
                );
              })}
            </div>

            <button
              ref={byActivityMenuRef}
              style={{ color: textColor }}
              onClick={() => toggleByActivityMenu()}
              className="pw-hidden sm:pw-inline-flex pw-relative pw-min-w-max pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-text-base pw-font-semibold pw-px-4 pw-py-2.5 pw-text-center pw-items-center pw-border-none pw-cursor-pointer"
            >
              {translate('storefront>menu>dropdown>byActivity')}
              <ArrowDownIcon style={{ fill: textColor }} />
              {isByActivityMenuOpen && (
                <div
                  className="pw-absolute pw-top-10 pw-z-10 pw-max-h-96 pw-overflow-auto pw-drop-shadow-2xl pw-border-2 pw-border-blue-500 pw-px-6 pw-py-6 pw-flex pw-flex-col pw-justify-between pw-w-[164px]"
                  style={{ backgroundColor: bgColor }}
                >
                  {categories?.map((category) => {
                    return (
                      <a
                        key={category.slug}
                        className="pw-py-4"
                        style={{ color: textColor }}
                        href={category.slug}
                      >
                        {category.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </button>
          </div>
        </div>

        <SeeAllMenu
          bgColor={bgColor}
          textColor={textColor}
          categories={categories}
          isMenuSeeAllOpen={isSeeAllMenuOpen}
        />
      </div>
    </TranslatableComponent>
  );
};

const SeeAllMenu = (props: MenuProps & { isMenuSeeAllOpen: boolean }) => {
  const { bgColor, textColor, categories, isMenuSeeAllOpen } = props;

  if (!isMenuSeeAllOpen) return null;

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="pw-w-full pw-flex pw-justify-center pw-px-5 pw-font-poppins"
    >
      <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center pw-container">
        <div className="pw-flex pw-flex-wrap pw-w-full pw-justify-around">
          {categories?.map((category) => {
            return (
              <a
                key={category.slug}
                className="pw-no-underline pw-font-semibold pw-px-2 pw-py-4 pw-min-w-max"
                style={{ color: textColor }}
                href={category.slug}
              >
                {category.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type MenuData = {
  type: 'menu';
  categories?: CategoryItem[];
} & Partial<MenuDefault>;
type CategoryItem = { label: string; slug: string };

export type MenuDefault = {
  bgColor: string;
  textColor: string;
};

type MenuProps = Omit<MenuData & MenuDefault, 'type'>;
