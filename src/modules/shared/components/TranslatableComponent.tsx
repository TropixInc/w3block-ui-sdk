import { ReactNode, startTransition, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../core/config/i18n";



interface TranslatableComponentProps {
  children: ReactNode;
}

const TranslatableComponent = ({ children }: TranslatableComponentProps) => {
  const [, setHasHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setHasHydrated(true);
    });
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslatableComponent;
