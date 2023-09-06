import { useContext } from 'react';

import { ThemeContext } from '../../contexts';

export const UseThemeConfig = () => {
  const context = useContext(ThemeContext);
  return { ...context };
};
