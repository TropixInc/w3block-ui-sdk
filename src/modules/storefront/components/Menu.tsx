import { useToggle } from 'react-use';

import { ReactComponent as ArrowDownIcon } from '../../shared/assets/icons/arrowDownLine.svg';
import { MenuData, MenuDefault } from '../interfaces';

export const Menu = ({
  data,
  defaultData,
}: {
  data: MenuData;
  defaultData: MenuDefault;
}) => {
  const [isMenuOpen, toggleMenu] = useToggle(false);

  const bgColor = data?.bgColor || defaultData.menuBgColor;
  const textColor = data?.textColor || defaultData.menuTextColor;
  const categories = data?.categories;

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="pw-w-full pw-px-5 absolute pw-h-57 pw-font-poppins"
    >
      <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center">
        <button
          style={{ color: textColor }}
          className="pw-border pw-border-solid pw-border-transparent pw-border-[#fff] md:pw-w-44 pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-rounded-3xl pw-text-base pw-px-4 pw-text-center pw-items-center pw-cursor-pointer pw-inline-flex"
        >
          veja todos
          <ArrowDownIcon />
        </button>

        <div className="pw-hidden sm:pw-block">
          <ul className="pw-flex">
            {categories?.map((category) => {
              return (
                <li key={category.slug} className="pw-list-none pw-px-2">
                  <a
                    className="pw-no-underline pw-font-semibold"
                    style={{ color: textColor }}
                    href={category.slug}
                  >
                    {category.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          style={{ color: textColor }}
          onClick={() => toggleMenu()}
          className="pw-hidden sm:pw-inline-flex pw-relative md:pw-w-44 pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-text-base pw-font-semibold pw-px-4 pw-py-2.5 pw-text-center pw-items-center pw-border-none pw-cursor-pointer"
        >
          Por atividade
          <ArrowDownIcon />
          {isMenuOpen && (
            <div
              className="pw-absolute pw-top-10 pw-z-10 pw-drop-shadow-2xl pw-border-2 pw-border-blue-500 pw-px-6 pw-py-6 pw-flex pw-flex-col pw-justify-between pw-w-[164px]"
              style={{ backgroundColor: bgColor }}
            >
              {categories?.map((category) => {
                return (
                  <div key={category.slug} className="pw-py-4">
                    {category.label}
                  </div>
                );
              })}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
