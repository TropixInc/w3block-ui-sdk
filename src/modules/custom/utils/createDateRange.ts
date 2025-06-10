// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDateRange(dateArray: any) {
  const ranges = [];

  for (let i = 0; i < dateArray?.length - 1; i++) {
    const range = {
      start: new Date(dateArray[i]),
      end: new Date(dateArray[i + 1]),
    };
    ranges.push(range);
  }

  const lastDate = new Date(dateArray[dateArray?.length - 1]);
  const currentDate = new Date();
  const lastRange = {
    start: lastDate,
    end: currentDate,
  };
  ranges.push(lastRange);

  return ranges;
}
