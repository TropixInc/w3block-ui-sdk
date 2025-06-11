import { useContext } from 'react';
import { TagManagerContext } from '../../core/providers/TagManagerProvider';

export const useDispatchGaEvent = (): any => {
  return useContext(TagManagerContext);
};
