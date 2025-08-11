import { useDispatchGaEvent } from "../../shared/hooks/useDispatchGaEvent";
import { useProfile } from "../../shared/hooks/useProfile";

export const useTrack = () => {
  const { gtag } = useDispatchGaEvent();
  const user = useProfile();
  const track = (evt: string, parameters: any) => {
    if (gtag) {
      gtag(evt, {
        userId: user?.data?.data?.id ?? '',
        userEmail: user?.data?.data?.email ?? '',
        ...parameters,
      });
    }
  };

  return track;
};
