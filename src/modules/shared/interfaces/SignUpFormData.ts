export interface SignUpFormData {
  email: string;
  password: string;
  confirmation: string;
  acceptsPolicyTerms: boolean;
  acceptsTermsOfUse: boolean;
}

export interface AuthLayoutBaseClasses {
  root?: string;
  contentContainer?: string;
  logoContainer?: string;
  logo?: string;
  title?: string;
}
