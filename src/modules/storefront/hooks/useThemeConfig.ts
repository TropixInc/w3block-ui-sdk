import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';



export const useThemeConfig = () => {
  const context = useContext(ThemeContext);
  return { ...context };
};
