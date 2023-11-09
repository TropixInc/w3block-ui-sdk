import { AthletePage } from '../kyraGracie';

export const getPageMap = (page: string) => {
  switch (page) {
    case 'athlete':
      return <AthletePage />;
    default:
      return null;
  }
};
