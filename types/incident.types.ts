export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "REPORTED"
  | "VERIFIED"
  | "DISPATCHING"
  | "RESPONDER_ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CANCELLED"
  | "REJECTED";

export interface IncidentCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_name?: string | null;
  iconName?: string | null;
  sort_order?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface AdminIncidentCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconName: string | null;
  sortOrder: number;
  isActive: boolean;
  incidentsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  iconName?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: number;
}

export interface Incident {
  id: number;
  reportedBy: number;
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  locationAccuracyMeters?: number | null;
  addressText?: string | null;
  areaName?: string | null;
  district?: string | null;
  upazila?: string | null;
  incidentStartedAt?: string | null;
  reportedAt: string;
  verifiedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  categoryId: number;
  categoryName: string;
  categorySlug?: string;
  categoryIcon?: string | null;
  imageUrls?: string[];
}

export interface IncidentStatusHistoryItem {
  id: number;
  incidentId: number;
  oldStatus: IncidentStatus | null;
  newStatus: IncidentStatus;
  note: string | null;
  createdAt: string;
  changedBy: number | null;
  changedByName?: string | null;
  changedByPhone?: string | null;
}

export interface CreateIncidentRequest {
  incidentCategoryId: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  latitude: number;
  longitude: number;
  locationAccuracyMeters?: number | null;
  addressText?: string | null;
  areaName?: string | null;
  district?: string | null;
  upazila?: string | null;
}

export interface CreateIncidentResponseData {
  id: number;
  status: IncidentStatus;
}

export interface DivisionCrisisStat {
  division: string;
  totalIncidents: number;
  criticalCount: number;
  activeDispatches: number;
  volunteerCount: number;
  crisisIndex: number;
  alertLevel: "HIGH_ALERT" | "MODERATE" | "NORMAL";
}

export interface NationalCrisisVolunteer {
  userId: number;
  name: string;
  phone: string;
  district: string | null;
  upazila: string | null;
  latitude: number;
  longitude: number;
  volunteerStatus: "AVAILABLE" | "UNAVAILABLE" | "ON_MISSION";
  serviceRadiusKm: number;
}

export interface NationalCrisisTelemetry {
  incidents: (Incident & {
    respondersCount?: number;
    imageUrls?: string[];
  })[];
  volunteers: NationalCrisisVolunteer[];
  divisionStats: DivisionCrisisStat[];
  totalIncidents: number;
  totalVolunteers: number;
  criticalIncidentsCount: number;
  activeDispatchesCount: number;
}
