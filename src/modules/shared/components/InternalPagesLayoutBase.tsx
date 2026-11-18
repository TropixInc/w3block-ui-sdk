/* eslint-disable i18next/no-literal-string */
import { ReactNode, useEffect, useState } from 'react';

import classNames from 'classnames';

import { useRouterConnect } from '../hooks/useRouterConnect';
import useTranslation from '../hooks/useTranslation';
import { Menu } from './Menu';
import TranslatableComponent from './TranslatableComponent';

interface Props {
  classes?: {
    childrenContainer?: string;
    middleSectionContainer?: string;
  };
  children?: ReactNode;
}

const BurgerIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
    <path
      d="M1 1h16M1 7h16M1 13h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M1 1l12 12M13 1L1 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const _InternalPagesLayoutBase = ({ classes = {}, children }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouterConnect();
  const [translate] = useTranslation();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  // Lock the page scroll while the drawer is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previous = document.body.style.overflow;
    if (drawerOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <div className="pw-flex pw-flex-col pw-w-screen pw-font-poppins pw-pb-[60px]">
      <div className="pw-container pw-mx-auto">
        <div className="sm:pw-hidden pw-px-4 pw-pt-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            className="pw-inline-flex pw-items-center pw-gap-2 pw-h-9 pw-px-3 pw-rounded-lg pw-bg-white pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)] pw-text-[13px] pw-font-semibold pw-text-[#0F1729]"
          >
            <BurgerIcon />
            {translate('components>menu>openMenu')}
          </button>
        </div>
        <div
          className={classNames(
            'pw-flex pw-w-full pw-flex-1 sm:pw-pt-[40px] pw-pt-3 sm:pw-gap-6',
            classes.middleSectionContainer ?? ''
          )}
        >
          <div className="pw-w-[260px] pw-shrink-0 pw-hidden sm:pw-block pw-self-start sm:pw-sticky sm:pw-top-4">
            <Menu />
          </div>
          <div className="pw-flex pw-flex-col pw-w-full pw-flex-1 pw-min-w-0 pw-overflow-x-hidden">
            <div
              className={classNames('pw-flex-1', classes.childrenContainer ?? '')}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <div className="pw-fixed pw-inset-0 pw-z-50 sm:pw-hidden" role="dialog" aria-modal>
          <div
            className="pw-absolute pw-inset-0 pw-bg-[#0F1729]/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="pw-absolute pw-inset-y-0 pw-left-0 pw-w-[300px] pw-max-w-[86vw] pw-bg-[#F3F5F8] pw-p-3 pw-overflow-y-auto pw-shadow-xl">
            <div className="pw-flex pw-justify-end pw-mb-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={translate('components>menu>closeMenu')}
                className="pw-grid pw-place-items-center pw-w-8 pw-h-8 pw-rounded-full pw-bg-white pw-text-[#4A5567] pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <CloseIcon />
              </button>
            </div>
            <Menu onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const InternalPagesLayoutBase = (props: Props) => (
  <TranslatableComponent>
    <_InternalPagesLayoutBase {...props} />
  </TranslatableComponent>
);
