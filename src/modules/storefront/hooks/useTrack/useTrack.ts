import { useProfile } from '../../../shared';
import { useDispatchGaEvent } from '../../../shared/hooks/useDispatchGaEvent/useDispatchGaEvent';

export const useTrack = () => {
  const { gtag } = useDispatchGaEvent();
  const user = useProfile();
  const track = (evt: string, parameters: any) => {
    if (gtag) {
      gtag(evt, {
        userId: user.data?.data.id ?? '',
        ...parameters,
      });
    }
  };

  return track;
};
