import { createContext, ReactNode, useContext, useMemo } from 'react';

interface Props {
  children: ReactNode;
  name: string;
}

interface FormControllerContext {
  name: string;
}

type LabelProps = {
  className?: string;
  children?: ReactNode;
};

// Check if context already exists (for symlink development)
const globalKey = '__FORM_CONTROLLER_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<FormControllerContext>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<FormControllerContext>({} as FormControllerContext);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

const FormControllerContext = context;

export const HeadlessFormController = ({ children, name }: Props) => {
  const value = useMemo(() => {
    return {
      name,
    };
  }, [name]);
  return (
    <FormControllerContext.Provider value={value}>
      {children}
    </FormControllerContext.Provider>
  );
};

const Label = ({ className = '', children }: LabelProps) => {
  const context = useContext(FormControllerContext);
  return (
    <label htmlFor={context.name} className={className}>
      {children}
    </label>
  );
};

HeadlessFormController.Label = Label;
