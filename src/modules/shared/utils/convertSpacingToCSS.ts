export const convertSpacingToCSS = (spacing: string | undefined) =>
  spacing
    ?.split(',')
    .map((s) => (s || 0) + 'px')
    .join(' ');
