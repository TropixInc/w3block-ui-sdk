import { useContext } from 'react';

import { TagManagerContext } from '../../../core/providers/TagManagerProvider/TagManagerProvider';

export const useDispatchGaEvent = () => {
  return useContext(TagManagerContext);
};
