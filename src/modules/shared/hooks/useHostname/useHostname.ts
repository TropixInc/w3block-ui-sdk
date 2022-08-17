import { useContext } from 'react';

import { HostnameContext } from '../../../core/styles/providers/HostnameProvider';

const useHostname = () => {
  return useContext(HostnameContext);
};

export default useHostname;
