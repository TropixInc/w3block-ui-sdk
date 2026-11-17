import { Tone } from '../components/ui/tokens';

/**
 * User-context (form / KYC) status → pill tone and label key. Values follow
 * `UserContextStatus` from `@w3block/sdk-id`; compared as strings so an
 * unknown status degrades to a grey pill instead of breaking the page.
 */
export const contextStatusTone = (status?: string): Tone => {
  switch (status) {
    case 'approved':
      return 'ok';
    case 'denied':
      return 'bad';
    case 'requiredReview':
      return 'warn';
    case 'created':
      return 'info';
    default:
      return 'grey';
  }
};

export const contextStatusLabelKey = (status?: string) => {
  switch (status) {
    case 'approved':
      return 'shared>contextStatus>approved';
    case 'denied':
      return 'shared>contextStatus>denied';
    case 'requiredReview':
      return 'shared>contextStatus>requiredReview';
    case 'created':
      return 'shared>contextStatus>created';
    case 'draft':
      return 'shared>contextStatus>draft';
    default:
      return 'shared>contextStatus>unknown';
  }
};
