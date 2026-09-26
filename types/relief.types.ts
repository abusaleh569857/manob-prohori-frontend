export interface ReliefDocument {
  id: number;
  document_type: 'IDENTITY' | 'MEDICAL' | 'POLICE_REPORT' | 'INCIDENT_PROOF' | 'OTHER';
  file_url: string;
  created_at?: string;
}

export interface ReliefDonation {
  id: number;
  donor_name?: string;
  amount: number;
  payment_method: 'BKASH' | 'NAGAD' | 'ROCKET' | 'BANK' | 'CASH_HANDOVER' | 'OTHER';
  transaction_reference?: string;
  donated_at: string;
}

export interface ReliefCampaign {
  id: number;
  requested_by: number;
  requester_name: string;
  requester_phone: string;
  requester_email?: string;
  incident_id?: number | null;
  title: string;
  description: string;
  required_amount: number;
  current_amount: number;
  progress_percent: number;
  bkash_number?: string | null;
  nagad_number?: string | null;
  rocket_number?: string | null;
  contact_phone: string;
  address_text?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLOSED' | 'EXPIRED';
  public_visibility: boolean;
  cover_image?: string | null;
  donations_count?: number;
  documents_count?: number;
  documents?: ReliefDocument[];
  recent_donations?: ReliefDonation[];
  submitted_at: string;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  latest_verification_notes?: string | null;
}

export interface CreateReliefRequestInput {
  title: string;
  description: string;
  requiredAmount: number;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  contactPhone: string;
  addressText?: string;
  latitude?: number;
  longitude?: number;
  incidentId?: number;
  documents?: Array<{ documentType: string; fileUrl: string }>;
}

export interface RecordDonationInput {
  reliefRequestId: number;
  amount: number;
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'BANK' | 'CASH_HANDOVER' | 'OTHER';
  transactionReference?: string;
  donorName?: string;
  donorPhone?: string;
}

export interface ReviewReliefRequestInput {
  id: number;
  status: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'CLOSED';
  publicVisibility?: boolean;
  notes?: string;
  rejectionReason?: string;
}

export interface ReliefFilters {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
