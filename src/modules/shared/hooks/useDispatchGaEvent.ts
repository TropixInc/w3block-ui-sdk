import { useContext } from 'react';
import { TagManagerContext } from '../../core/metamask/providers/TagManagerProvider';

export const useDispatchGaEvent = (): any => {
  return useContext(TagManagerContext);
};
