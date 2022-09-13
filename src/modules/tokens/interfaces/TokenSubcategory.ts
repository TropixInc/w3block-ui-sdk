import { DynamicFormConfiguration } from './DynamicFormConfiguration';
import { TokenCategory } from './TokenCategory';

export interface TokenSubcategory {
  categoryId: string;
  companyId: string;
  createdAt: string;
  id: string;
  name: string;
  tokenTemplate: DynamicFormConfiguration;
  category?: TokenCategory;
}
