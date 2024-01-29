import { Redirect } from '../../storefront';
import { AthletePage } from '../kyraGracie';

export const getPageMap = (page: string) => {
  switch (page) {
    case 'athlete':
      return <AthletePage />;
    case 'redirect':
      return <Redirect />;
    default:
      return null;
  }
};
