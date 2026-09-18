export interface Specialty {
  id: number;
  name: string;
  slug: string;
  isActive?: boolean;
}

export interface HospitalServiceItem {
  id?: number;
  hospitalId?: number;
  serviceName: string;
  phone?: string;
  isAvailable?: boolean;
  notes?: string;
}

export interface Hospital {
  id: number;
  name: string;
  nameBn?: string;
  facilityType?: string;
  ownership?: string;
  phone: string;
  email?: string;
  addressText: string;
  division?: string;
  district?: string;
  upazila?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  emergencyAvailable: boolean;
  isActive: boolean;
  distanceKm?: number;
  specialties: Specialty[];
  services: HospitalServiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface HospitalFilters {
  search?: string;
  division?: string;
  district?: string;
  emergencyOnly?: boolean | string;
  specialtyId?: number | string;
  latitude?: number;
  longitude?: number;
  limit?: number;
  offset?: number;
  isAdmin?: boolean;
}

export interface CreateHospitalInput {
  name: string;
  nameBn?: string;
  facilityType?: string;
  ownership?: string;
  phone: string;
  email?: string;
  addressText: string;
  division?: string;
  district?: string;
  upazila?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  emergencyAvailable?: boolean;
  specialtyIds?: number[];
  services?: Array<{ serviceName: string; phone?: string; notes?: string }>;
}

export interface UpdateHospitalInput extends Partial<CreateHospitalInput> {
  id: number;
  isActive?: boolean;
}

export interface EmergencyServiceContact {
  id: number;
  emergencyServiceId: number;
  regionName: string;
  phoneNumber: string;
  displayLabel?: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface EmergencyService {
  id: number;
  name: string;
  serviceType: 'AMBULANCE' | 'POLICE' | 'FIRE' | 'NATIONAL_EMERGENCY' | 'OTHER';
  description?: string;
  isActive: boolean;
  sortOrder: number;
  contacts: EmergencyServiceContact[];
}
