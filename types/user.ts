export interface ClerkEmailAddress {
  id: string;
  emailAddress: string;
  verification: { status: string } | null;
}

export interface ClerkPhoneNumber {
  id: string;
  phoneNumber: string;
  verification: { status: string } | null;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  emailAddresses: ClerkEmailAddress[];
  phoneNumbers: ClerkPhoneNumber[];
  publicMetadata: Record<string, unknown>;
  privateMetadata: Record<string, unknown>;
  unsafeMetadata: Record<string, unknown>;
  banned: boolean;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
  lastSignInAt: number | null;
  lastActiveAt: number | null;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
