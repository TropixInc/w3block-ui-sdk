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

const FormControllerContext = createContext<FormControllerContext>(
  {} as FormControllerContext
);

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
