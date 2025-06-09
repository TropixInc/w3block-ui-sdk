export const getNumbersFromString = (value: string, float?: boolean) => {
  if (!float) return value.replace(/[^0-9]/g, '');
  const numbers = value.replace(/[^0-9.]/g, '');
  const firstIndexOfDot = numbers.indexOf('.');
  if (firstIndexOfDot === numbers.lastIndexOf('.')) return numbers;
  return Array.from(numbers).reduce(
    (accumulator, current, index) =>
      current !== '.' || firstIndexOfDot === index
        ? accumulator.concat(current)
        : accumulator,
    ''
  );
};
