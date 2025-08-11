import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCounter, useHarmonicIntervalFn } from 'react-use';
import { useTimeDistance } from './useTimeDistance';



const defaultDate = new Date();

const useCountdown = () => {
  const [initialDate, setInitialDate] = useState<Date>(defaultDate);
  const [finalDate, setFinalDate] = useState<Date>(defaultDate);
  const distance = useTimeDistance(initialDate, finalDate);
  const [days, daysAction] = useCounter(distance.days);
  const [hours, hoursAction] = useCounter(distance.hours);
  const [minutes, minutesAction] = useCounter(distance.minutes);
  const [seconds, secondsAction] = useCounter(distance.seconds);
  const [delay, setDelay] = useState(1000);

  const isActive = days > 0 || seconds > 0 || minutes > 0 || hours > 0;

  useHarmonicIntervalFn(() => {
    if (isActive) {
      decrementSeconds();
    }
  }, delay);

  useEffect(() => {
    daysAction.set(distance.days);
    hoursAction.set(distance.hours);
    minutesAction.set(distance.minutes);
    secondsAction.set(distance.seconds);
  }, [distance, hoursAction, minutesAction, secondsAction, daysAction]);

  const decrementHours = () => {
    if (hours > 0) {
      hoursAction.dec();
    } else if (isActive) {
      hoursAction.set(23);
      daysAction.dec();
    }
  };

  const decrementMinutes = () => {
    if (minutes > 0) {
      minutesAction.dec();
    } else if (isActive) {
      minutesAction.set(59);
      decrementHours();
    }
  };

  const decrementSeconds = () => {
    if (seconds > 0) {
      secondsAction.dec();
    } else if (isActive) {
      secondsAction.set(59);
      decrementMinutes();
    }
  };

  const setNewCountdown = useCallback((newFinalDate: Date) => {
    setInitialDate(new Date());
    setFinalDate(newFinalDate);
    setDelay(1000);
  }, []);

  const getReturnValue = (time: number) => {
    return Number.isNaN(time) ? 0 : time;
  };

  return useMemo(
    () => ({
      days: getReturnValue(days),
      hours: getReturnValue(hours),
      minutes: getReturnValue(minutes),
      seconds: getReturnValue(seconds),
      isActive,
      setNewCountdown,
    }),
    [days, hours, minutes, seconds, isActive, setNewCountdown]
  );
};

export default useCountdown;
