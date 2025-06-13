import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import classNames from 'classnames';

import AlertTriangle from '../assets/icons/alertTriangle.svg';
import CheckCircledFilled from '../assets/icons/checkCircledFilled.svg';
import ErrorCircledFilled from '../assets/icons/errorCircledFilled.svg';
import ExclamationCircledFilled from '../assets/icons/exclamationCircledFilled.svg';
import InformationCircledFilled from '../assets/icons/informationCircledFilled.svg';

type AlertVariant =
  | 'error'
  | 'warning'
  | 'success'
  | 'information'
  | 'atention';

export interface AlertProps {
  variant?: AlertVariant;
  scrollToOnMount?: boolean;
  className?: string;
  children: ReactNode;
}

interface IconProps {
  className?: string;
}

interface AlertContext {
  variant: AlertVariant;
}

const AlertContext = createContext<AlertContext>({} as AlertContext);

const iconConfigMap = new Map([
  ['error', { Element: ErrorCircledFilled, className: 'pw-fill-[#D02428]' }],
  ['atention', { Element: AlertTriangle }],
  [
    'warning',
    { Element: ExclamationCircledFilled, className: 'pw-fill-[#EEA109]' },
  ],
  ['success', { Element: CheckCircledFilled, className: '' }],
  ['information', { Element: InformationCircledFilled, className: '' }],
]);

const variantClassNamesMap = new Map<AlertVariant, string>([
  ['error', 'pw-text-[#D02428] pw-bg-[#F3D9DC]'],
  ['atention', 'pw-text-[#D02428] pw-bg-[#F3D9DC]'],
  ['warning', 'pw-bg-[#FFF9E3] pw-text-[#EEA109]'],
  ['success', 'pw-bg-[#DFF5EB] pw-text-[#17C490]'],
  ['information', 'pw-bg-[#D7E3F3] pw-text-[#5682C3]'],
]);

export const Alert = ({
  variant = 'information',
  className,
  children,
  scrollToOnMount = false,
}: AlertProps) => {
  const value = useMemo(() => ({ variant }), [variant]);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      elementRef.current &&
      scrollToOnMount
    ) {
      window.scrollTo({
        left: 0,
        top: elementRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [scrollToOnMount]);

  const variantClassnames = variantClassNamesMap.get(variant) ?? '';
  return (
    <AlertContext.Provider value={value}>
      <div
        ref={elementRef}
        className={classNames(
          className,
          'pw-w-full pw-p-3 pw-flex pw-items-center pw-justify-center pw-font-semibold pw-text-base pw-leading-[19px] pw-rounded-lg',
          variantClassnames,
          ''
        )}
      >
        {children}
      </div>
    </AlertContext.Provider>
  );
};

const Icon = ({ className = '' }: IconProps) => {
  const { variant } = useContext(AlertContext);
  const variantIconConfig = iconConfigMap.get(variant);

  return variantIconConfig ? (
    <variantIconConfig.Element
      className={classNames(className, variantIconConfig.className)}
    />
  ) : null;
};

Alert.Icon = Icon;
