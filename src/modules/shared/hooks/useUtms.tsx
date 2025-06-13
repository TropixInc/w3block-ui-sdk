import { useContext } from 'react';
import { UtmContext, UtmContextInterface } from '../../core/context/UtmContext';




export const useUtms = (): UtmContextInterface => {
  const context = useContext(UtmContext);
  return context;
};
