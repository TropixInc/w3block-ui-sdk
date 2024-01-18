import { isEqual, isAfter, isBefore } from 'date-fns';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function groupByDateRange(objectArray: any, dateRange: any) {
  return dateRange?.reduce((acc: any, range: any) => {
    const objectsOnRange = objectArray.filter((object: any) => {
      const objectDate = new Date(object?.date);
      return (
        (isEqual(objectDate, range?.start) ||
          isAfter(objectDate, range?.start)) &&
        isBefore(objectDate, range?.end)
      );
    });

    if (objectsOnRange?.length > 0) {
      acc.push(objectsOnRange);
    }

    return acc;
  }, []);
}
