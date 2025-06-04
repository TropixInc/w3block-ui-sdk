import { useContext } from 'react';
import { W3blockAuthenticationContext } from '../context/W3blockAuthenticationContext';




export const usePixwayAuthentication = () => {
  return useContext(W3blockAuthenticationContext);
};
