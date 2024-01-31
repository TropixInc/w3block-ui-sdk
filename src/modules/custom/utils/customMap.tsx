import { Redirect } from '../../storefront';
import { WjjcStart } from '../../storefront/components/WjjcStart';
import { AthletePage } from '../kyraGracie';

export const getPageMap = (page: string) => {
  switch (page) {
    case 'wjjcStart':
      return <WjjcStart />;
    case 'athlete':
      return <AthletePage />;
    case 'redirect':
      return <Redirect />;
    default:
      return null;
  }
};
