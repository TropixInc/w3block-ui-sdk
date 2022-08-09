import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../core/config/i18n';

interface TranslatableComponentProps {
  children: ReactNode;
}

const TranslatableComponent = ({ children }: TranslatableComponentProps) => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  ) : null;
};

export default TranslatableComponent;
