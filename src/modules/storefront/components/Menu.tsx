import React from 'react';

import { Link } from '../../shared/components/Link';
import { MenuData, MenuDefault } from '../interfaces';

export const Menu = ({
  data,
  defaultData,
}: {
  data: MenuData;
  defaultData: MenuDefault;
}) => {
  const color = data.bgColor || defaultData.textColor;
  const categories = data.categories || defaultData.categories;

  return (
    <div
      style={{ backgroundColor: color }}
      className="pw-w-full pw-px-5 absolute pw-h-57"
    >
      <div className="pw-flex pw-justify-center pw-gap-2 pw-py-3 pw-items-center">
        <button
          id="dropdownDefault"
          data-dropdown-toggle="dropdown"
          className="pw-text-white md:pw-w-44 xs:pw-w-52 pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-rounded-3xl pw-text-sm sm:pw-px-4 pw-text-center pw-inline-flex pw-items-center pw-border-white pw-cursor-pointer"
          type="button"
        >
          ver tudo
          <svg
            className="w-fill-current pw-h-4 pw-w-4 pw-white"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
          <div
            id="dropdown"
            className="pw-hidden pw-z-10 pw-w-52 bg-white pw-divide-y pw-divide-white dark:bg-gray-700 pw-rounded-none"
          >
            <ul
              className="pw-py-1 text-sm pw-text-gray-700 dark:text-gray-200 group-hover:block"
              aria-labelledby="dropdownDefault"
            >
              <li>
                <Link
                  href="#"
                  className="pw-block pw-py-2 pw-list-none pw-px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  items
                </Link>
              </li>
            </ul>
          </div>
        </button>
        {categories?.map((nomes, index) => {
          return (
            <>
              <div className="xs:pw-hidden sm:pw-block">
                <ul key={index}>
                  <li className="pw-list-none">
                    <Link
                      href={nomes.slug}
                      className="pw-text-white pw-no-underline"
                    >
                      {nomes.label}
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          );
        })}
        <button
          data-dropdown-toggle="dropdown"
          className="pw-text-white md:pw-w-44 xs:pw-w-52 pw-h-10 pw-gap-2 pw-justify-center pw-bg-transparent pw-text-sm sm:pw-px-4 pw-py-2.5 pw-text-center pw-inline-flex pw-items-center pw-border-none pw-cursor-pointer"
          type="button"
        >
          Por atividade
          <svg
            className="w-fill-current pw-h-4 pw-w-4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
          <div
            id="dropdown"
            className="pw-hidden pw-z-10 pw-w-52 bg-white pw-rounded pw-divide-y pw-divide-white"
          >
            <ul
              className="pw-py-1 text-sm pw-text-gray-700 dark:text-gray-200 group-hover:block"
              aria-labelledby="dropdownDefault"
            >
              <li>
                <Link
                  href="#"
                  className="pw-block pw-py-2 pw-list-none pw-px-4 hover:bg-gray-100"
                >
                  items
                </Link>
              </li>
            </ul>
          </div>
        </button>
      </div>
    </div>
  );
};
