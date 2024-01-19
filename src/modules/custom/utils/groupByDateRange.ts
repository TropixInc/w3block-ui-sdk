import { isEqual, isAfter, isBefore } from 'date-fns';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function groupByDateRange(objectArray: any, dateRange: any) {
  return dateRange?.reduce((acc: any, range: any) => {
    const objectsOnRange = objectArray.filter((object: any) => {
      const objectDate = Date.parse(
        object?.date ? object?.date + 'T12:00:00' : object?.dateOfIssue
      );
      return (
        (isEqual(objectDate, range?.start) ||
          isAfter(objectDate, range?.start)) &&
        isBefore(objectDate, range?.end)
      );
    });

    if (objectsOnRange?.length > 0) {
      objectsOnRange.sort(function (a: any, b: any) {
        const dateA = Date.parse(
          a?.date ? a?.date + 'T12:00:00' : a?.dateOfIssue
        );
        const dateB = Date.parse(
          b?.date ? b?.date + 'T12:00:00' : b?.dateOfIssue
        );
        if (isBefore(dateA, dateB)) return -1;
        if (isAfter(dateA, dateB)) return 1;
        return 0;
      });
      acc.push(objectsOnRange);
    }
    return acc;
  }, []);
}
