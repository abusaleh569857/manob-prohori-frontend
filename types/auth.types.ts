export type UserRole = "USER" | "VOLUNTEER" | "BLOOD_DONOR" | "ADMIN";

export interface User {
  id: number;
  phone: string;
  email: string | null;
  fullName: string;
  profilePhotoUrl?: string | null;
  district?: string | null;
  roles: UserRole[];
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  accountType?: "USER" | "VOLUNTEER" | "BLOOD_DONOR";
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  bloodGroupId?: number;
  addressLine?: string;
  district?: string;
  upazila?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface LoginRequest {
  identifier: string; // phone or email
  password: string;
}

export interface UserProfile extends User {
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  bloodGroupId?: number | null;
  bloodGroup?: string | null;
  addressLine?: string | null;
  city?: string | null;
  upazila?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
}
