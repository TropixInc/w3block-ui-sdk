import { useContext } from 'react';
import { EnvironmentContext } from '../../core/context/EnvironmentContext';




export const useIsProduction = () =>
  useContext(EnvironmentContext).isProduction;
