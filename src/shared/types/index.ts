// ===== Theme & i18n =====
export type ThemeName = 'blue' | 'brown' | 'black' | 'silver' | 'green';
export type LanguageCode = 'kk' | 'ru' | 'en';

// ===== Office =====
export type OfficeStatus = 'available' | 'reserved' | 'occupied';
export type OfficeType = 'openSpace' | 'cabinet' | 'block' | 'mixed';

export interface Office {
  id: string;
  title: string;
  floor: number;
  area: number; // m²
  type: OfficeType;
  status: OfficeStatus;
  price: number | null; // null = "по запросу"
  description: string;
  features: string[];
  images: string[]; // placeholder strings for now
}

// ===== Conference Room =====
export type ConferenceStatus = 'available' | 'reserved' | 'occupied';

export interface ConferenceRoom {
  id: string;
  name: string;
  capacity: number;
  area: number;
  hourlyPrice: number | null;
  status: ConferenceStatus;
  equipment: string[];
  description: string;
}

// ===== Tenant =====
export interface Tenant {
  id: string;
  companyName: string;
  category: string;
  floor: number;
  officeNumber: string;
  description: string;
  website?: string;
  contactEmail?: string;
  phone?: string;
  isPublished: boolean;
}

// ===== Lead =====
export type LeadInterestType = 'office' | 'conference' | 'general';
export type LeadStatus = 'new' | 'contacted' | 'inProgress' | 'closed';

export interface LeadComment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestType: LeadInterestType;
  message: string;
  status: LeadStatus;
  createdAt: string; // ISO
  comments: LeadComment[];
  relatedItemId?: string; // optional reference to office/room
}

// ===== Admin user =====
export type AdminUserRole = 'admin' | 'manager' | 'viewer';
export type AdminUserStatus = 'active' | 'disabled';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

// ===== Gallery =====
export interface GalleryImage {
  id: string;
  src: string;             // URL or /demo/*.svg path
  fallback?: string;       // local image used if src fails to load
  title: LocalizedText;
  caption: LocalizedText;
  order: number;
  isPublished: boolean;
}

// ===== News =====
export interface NewsArticle {
  id: string;
  slug: string;
  cover: string;           // image path
  coverFallback?: string;  // local image used if cover fails to load
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  tag: string;
  publishedAt: string;     // ISO
  isPublished: boolean;
}

// ===== Site settings =====
export interface LocalizedText {
  kk: string;
  ru: string;
  en: string;
}

export interface SiteSettings {
  businessCenterName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  theme: ThemeName;
  language: LanguageCode;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  aboutText: LocalizedText;
}
