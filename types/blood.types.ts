export interface BloodGroup {
  id: number;
  code: string;
  name: string;
}

export interface BloodDonorVerification {
  id: number;
  donor_user_id: number;
  verification_type: 'BLOOD_REPORT' | 'DONATION_REPORT' | 'HOSPITAL_DOCUMENT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hospital_name?: string | null;
  report_date?: string | null;
  blood_group_id?: number | null;
  document_url: string;
  notes?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
}

export interface BloodDonorDocument {
  id: number;
  donor_user_id: number;
  document_type: string;
  file_url: string;
  uploaded_at: string;
}

export interface BloodDonorProfile {
  user_id: number;
  blood_group_id: number;
  blood_group_code: string;
  blood_group_name: string;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  last_donation_date?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location_updated_at?: string | null;
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verified_at?: string | null;
  full_name: string;
  phone_number: string;
  email?: string;
  division?: string;
  district?: string;
  upazila?: string;
  address_text?: string;
  latest_verification?: BloodDonorVerification | null;
  documents?: BloodDonorDocument[];
}

export interface BloodRequest {
  id: number;
  requested_by: number;
  requester_name: string;
  contact_phone: string;
  incident_id?: number | null;
  blood_group_id: number;
  blood_group_code: string;
  blood_group_name: string;
  required_units: number;
  hospital_id?: number | null;
  hospital_name: string;
  needed_by?: string | null;
  description?: string | null;
  latitude: number;
  longitude: number;
  address_text?: string | null;
  status: 'OPEN' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
  updated_at: string;
  matches_count?: number;
  distance_km?: number | null;
}

export interface BloodRequestMatch {
  match_id: number;
  blood_request_id: number;
  distance_km?: number | null;
  notification_stage: 'MATCHED' | 'AREA_BROADCAST' | 'EXPANDED_RADIUS';
  match_status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED';
  matched_at: string;
  responded_at?: string | null;
  required_units: number;
  needed_by?: string | null;
  description?: string | null;
  address_text?: string | null;
  latitude: number;
  longitude: number;
  request_status: string;
  blood_group_code: string;
  hospital_name: string;
  requester_name: string;
  contact_phone: string;
}

export interface AdminDonorItem {
  user_id: number;
  name: string;
  phone: string;
  email?: string;
  blood_group: string;
  blood_group_name: string;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  last_donation_date?: string | null;
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verified_at?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location: string;
  verification_id?: number | null;
  verification_type?: string | null;
  hospital_name?: string | null;
  report_date?: string | null;
  document_url?: string | null;
  notes?: string | null;
  submitted_at?: string | null;
}

export interface CreateBloodRequestInput {
  bloodGroupId: number;
  requiredUnits?: number;
  hospitalName: string;
  hospitalId?: number;
  contactPhone: string;
  neededBy?: string;
  description?: string;
  latitude: number;
  longitude: number;
  addressText?: string;
  incidentId?: number;
}

export interface ApplyDonorInput {
  bloodGroupId: number;
  availability?: 'AVAILABLE' | 'UNAVAILABLE';
  lastDonationDate?: string;
  latitude?: number;
  longitude?: number;
  hospitalName?: string;
  reportDate?: string;
  documentUrl: string;
  notes?: string;
}

export interface BloodRequestFilters {
  bloodGroup?: string;
  status?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
  offset?: number;
}

export interface AdminDonorFilters {
  search?: string;
  bloodGroup?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
