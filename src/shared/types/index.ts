// =====================================================================
// Domain types for the Meridian Business Center platform.
// A single-language (English) premium commercial real-estate model.
// =====================================================================

export type ThemeName = 'blue' | 'green' | 'gold' | 'black' | 'silver' | 'brown';

/**
 * A text value provided in all three supported languages.
 * Resolve it for the active language with `pickLocale` (src/shared/utils).
 */
export interface Localized {
  kk: string;
  ru: string;
  en: string;
}

// ===== Authentication & roles =====
export type Role = 'admin' | 'manager' | 'viewer';

export interface Account {
  id: string;
  email: string;
  password: string; // demo only — never displayed after login
  fullName: string;
  role: Role;
  status: 'active' | 'disabled';
  /** Viewers are linked to the tenant company they belong to. */
  tenantId?: string;
  title?: string; // job title, shown in profile
  createdAt: string;
}

/** The trimmed account object kept in the session (no password). */
export interface Session {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  tenantId?: string;
  title?: string;
  loggedInAt: string;
}

// ===== Office / leasable space =====
export type SpaceStatus = 'available' | 'reserved' | 'occupied';
export type SpaceType = 'open-plan' | 'private-office' | 'suite' | 'coworking';

export interface Office {
  id: string;
  code: string; // e.g. "08-02"
  title: string;
  floor: number;
  area: number; // m²
  capacity: number; // workstations
  type: SpaceType;
  status: SpaceStatus;
  monthlyPrice: number | null; // null = "on request"
  description: string;
  features: string[];
  photo: string; // PhotoKey
  featured: boolean;
  tenantId?: string; // set when occupied
}

// ===== Meeting / conference rooms (bookable) =====
export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  area: number;
  hourlyPrice: number;
  floor: number;
  amenities: string[];
  description: string;
  photo: string; // PhotoKey
}

// ===== Tenant company =====
export interface Tenant {
  id: string;
  companyName: string;
  industry: string;
  logoText: string; // initials for avatar
  floor: number;
  officeCode: string;
  headcount: number;
  since: string; // ISO date lease started
  contactName: string;
  contactEmail: string;
  phone: string;
  website?: string;
  description: string;
  isPublished: boolean;
}

// ===== Leads (sales pipeline) =====
export type LeadInterest = 'office' | 'meeting-room' | 'coworking' | 'general';
export type LeadStatus = 'new' | 'contacted' | 'touring' | 'negotiation' | 'won' | 'lost';

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  interest: LeadInterest;
  message: string;
  status: LeadStatus;
  estimatedValue: number; // monthly value KZT
  source: string; // website, referral, walk-in...
  createdAt: string;
  notes: LeadNote[];
  relatedSpaceId?: string;
}

// ===== Bookings (meeting rooms) =====
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  tenantId?: string;
  title: string;
  organizer: string;
  date: string; // ISO date (yyyy-mm-dd)
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  attendees: number;
  status: BookingStatus;
  createdAt: string;
}

// ===== Maintenance requests =====
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type MaintenanceCategory =
  | 'hvac'
  | 'electrical'
  | 'plumbing'
  | 'cleaning'
  | 'access'
  | 'it'
  | 'other';

export interface MaintenanceUpdate {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  ref: string; // human ref e.g. "MR-1042"
  tenantId: string;
  spaceCode: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  subject: string;
  description: string;
  status: MaintenanceStatus;
  createdBy: string;
  createdAt: string;
  updates: MaintenanceUpdate[];
}

// ===== Invoices =====
export type InvoiceStatus = 'paid' | 'due' | 'overdue';

export interface InvoiceLine {
  label: string;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string; // "INV-2026-0042"
  tenantId: string;
  period: string; // "June 2026"
  issuedAt: string; // ISO
  dueAt: string; // ISO
  status: InvoiceStatus;
  lines: InvoiceLine[];
}

// ===== Gallery =====
export interface GalleryImage {
  id: string;
  photo: string; // PhotoKey
  title: Localized;
  caption: Localized;
  category: 'architecture' | 'interiors' | 'amenities' | 'events';
}

// ===== News =====
export interface NewsArticle {
  id: string;
  slug: string;
  photo: string; // PhotoKey
  tag: Localized;
  title: Localized;
  excerpt: Localized;
  body: Localized[]; // paragraphs
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

// ===== Testimonials =====
export interface Testimonial {
  id: string;
  quote: Localized;
  author: string;
  role: Localized;
  company: string;
}

// ===== Services / amenities =====
export interface Service {
  id: string;
  icon: string; // lucide icon name
  title: Localized;
  description: Localized;
}

// ===== Site settings =====
export interface SiteSettings {
  centerName: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: string;
  theme: ThemeName;
  foundedYear: number;
}
