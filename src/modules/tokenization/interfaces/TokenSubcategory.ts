import { TokenCategory } from '../hooks/useTokenCategories';
import { DynamicFormConfiguration } from './DynamicFormConfiguration';

export interface TokenSubcategory {
  categoryId: string;
  companyId: string;
  createdAt: string;
  id: string;
  name: string;
  tokenTemplate: DynamicFormConfiguration;
  category?: TokenCategory;
}
