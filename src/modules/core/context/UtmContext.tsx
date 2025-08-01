import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

export interface UtmContextInterface {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  expires?: number;
}

export const UtmContext = createSymlinkSafeContext<UtmContextInterface>(
  '__UTM_CONTEXT__',
  {}
);
