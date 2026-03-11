export interface SystemConfig {
  id: string;
  systemName: string;
  systemTitle: string;
  systemDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  logoUrl?: string;
  logoUrlDark?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  loginBgColor?: string;
  loginBgImage?: string;
  loginTextColor?: string;
  contactEmail?: string;
  supportUrl?: string;
  websiteUrl?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  version?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfigUpdate {
  systemName?: string;
  systemTitle?: string;
  systemDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  logoUrl?: string;
  logoUrlDark?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  loginBgColor?: string;
  loginBgImage?: string;
  loginTextColor?: string;
  contactEmail?: string;
  supportUrl?: string;
  websiteUrl?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  version?: string;
}

export interface FileUploadData {
  type: "logoUrl" | "logoUrlDark" | "faviconUrl" | "loginBgImage";
  base64: string;
  filename?: string;
}
