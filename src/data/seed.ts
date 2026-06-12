import type {
  Account,
  Office,
  MeetingRoom,
  Tenant,
  Lead,
  Booking,
  MaintenanceRequest,
  Invoice,
  GalleryImage,
  NewsArticle,
  Testimonial,
  Service,
  SiteSettings,
} from '@/shared/types';

const now = Date.now();
const DAY = 86_400_000;
const daysAgo = (d: number): string => new Date(now - d * DAY).toISOString();
const daysAhead = (d: number): string => new Date(now + d * DAY).toISOString();
const isoDate = (offsetDays: number): string =>
  new Date(now + offsetDays * DAY).toISOString().slice(0, 10);

// ===== Demo accounts (passwords are demo-only) =====
export const seedAccounts: Account[] = [
  {
    id: 'acc-admin',
    email: 'admin@crm.kz',
    password: 'admin123',
    fullName: 'Alexandra Petrova',
    role: 'admin',
    status: 'active',
    title: 'Center Director',
    createdAt: daysAgo(420),
  },
  {
    id: 'acc-manager',
    email: 'manager@crm.kz',
    password: 'manager123',
    fullName: 'Daniyar Akhmetov',
    role: 'manager',
    status: 'active',
    title: 'Leasing Manager',
    createdAt: daysAgo(300),
  },
  {
    id: 'acc-viewer',
    email: 'viewer@crm.kz',
    password: 'viewer123',
    fullName: 'Marina Klein',
    role: 'viewer',
    status: 'active',
    title: 'Office Manager · Northwind Capital',
    tenantId: 't-01',
    createdAt: daysAgo(180),
  },
  {
    id: 'acc-sofia',
    email: 'sofia@crm.kz',
    password: 'demo1234',
    fullName: 'Sofia Belova',
    role: 'manager',
    status: 'active',
    title: 'Community Manager',
    createdAt: daysAgo(120),
  },
  {
    id: 'acc-temir',
    email: 'temir@crm.kz',
    password: 'demo1234',
    fullName: 'Temirlan Sapayev',
    role: 'viewer',
    status: 'disabled',
    title: 'Operations · Aurum Legal',
    tenantId: 't-02',
    createdAt: daysAgo(90),
  },
];

// ===== Offices =====
export const seedOffices: Office[] = [
  {
    id: 'of-101', code: '04-02', title: 'Atelier Office', floor: 4, area: 86, capacity: 10,
    type: 'private-office', status: 'available', monthlyPrice: 1290000,
    description:
      'A bright fourth-floor private office with floor-to-ceiling glazing, a dedicated meeting nook and a kitchenette. Ideal for a team of up to ten.',
    features: ['Floor-to-ceiling windows', 'Private meeting nook', 'Ducted climate control', 'Dedicated fibre line'],
    photo: 'office', featured: true,
  },
  {
    id: 'of-102', code: '05-07', title: 'Skyline Suite', floor: 5, area: 142, capacity: 16,
    type: 'suite', status: 'available', monthlyPrice: 2150000,
    description:
      'A flexible suite combining an open-plan area for fourteen with two enclosed cabinets. Delivered fully fitted and cabled.',
    features: ['Open-plan + 2 cabinets', 'Server niche', 'Structured cabling', 'Two floor restrooms'],
    photo: 'openspace', featured: true,
  },
  {
    id: 'of-103', code: '07-01', title: 'Helios Block', floor: 7, area: 220, capacity: 28,
    type: 'suite', status: 'occupied', monthlyPrice: 3320000,
    description:
      'A full-floor block for an anchor tenant with its own reception, three meeting rooms and a lounge.',
    features: ['Private reception', '3 meeting rooms', 'Breakout lounge', 'Archive room'],
    photo: 'lounge', featured: false, tenantId: 't-03',
  },
  {
    id: 'of-104', code: '03-04', title: 'Compact Cabinet', floor: 3, area: 54, capacity: 6,
    type: 'private-office', status: 'available', monthlyPrice: 780000,
    description: 'A compact private office for up to six people on the quiet, light-filled side of the floor.',
    features: ['Bright aspect', 'Air conditioning', 'Move-in ready'],
    photo: 'desk', featured: false,
  },
  {
    id: 'of-105', code: '06-03', title: 'Panorama Open-Plan', floor: 6, area: 178, capacity: 22,
    type: 'open-plan', status: 'occupied', monthlyPrice: 2680000,
    description: 'A 22-desk open-plan floor with high ceilings, an acoustic ceiling system and a dedicated meeting room.',
    features: ['22 workstations', 'Acoustic ceiling', 'Meeting room', 'Print & copy zone'],
    photo: 'coworking', featured: false, tenantId: 't-02',
  },
  {
    id: 'of-106', code: '08-02', title: 'Penthouse Block', floor: 8, area: 310, capacity: 36,
    type: 'suite', status: 'available', monthlyPrice: null,
    description:
      'A premium upper-floor block with skyline views, two entrances and the option to reconfigure to the tenant brief.',
    features: ['Skyline views', 'Two entrances', 'Custom fit-out', 'Priority parking'],
    photo: 'lobby', featured: true, tenantId: 't-01',
  },
  {
    id: 'of-107', code: '02-05', title: 'Studio Office', floor: 2, area: 38, capacity: 4,
    type: 'private-office', status: 'available', monthlyPrice: 540000,
    description: 'A small second-floor office for a representative team or a small business.',
    features: ['Move-in ready', 'Near reception', 'Secure room'],
    photo: 'office', featured: false,
  },
  {
    id: 'of-108', code: '05-02', title: 'Meridian Cabinet', floor: 5, area: 96, capacity: 12,
    type: 'private-office', status: 'reserved', monthlyPrice: 1420000,
    description: 'A private office with its own meeting room and kitchenette on the quiet side of the building.',
    features: ['Private meeting room', 'Kitchenette', 'Quiet aspect', 'Double glazing'],
    photo: 'desk', featured: false,
  },
  {
    id: 'of-109', code: '04-06', title: 'Garden Open-Plan', floor: 4, area: 124, capacity: 14,
    type: 'open-plan', status: 'available', monthlyPrice: 1860000,
    description: 'A 14-seat open-plan workspace with natural ventilation and an informal breakout area.',
    features: ['14 workstations', 'Breakout area', 'Natural ventilation'],
    photo: 'coworking', featured: false,
  },
  {
    id: 'of-110', code: '09-01', title: 'Terrace Block', floor: 9, area: 260, capacity: 30,
    type: 'suite', status: 'available', monthlyPrice: 3920000,
    description: 'An exclusive top-floor block with a private terrace, its own hall and direct-access lift.',
    features: ['Private terrace', 'Own entrance hall', 'Direct-access lift', 'City panorama'],
    photo: 'lounge', featured: true,
  },
  {
    id: 'of-111', code: '01-03', title: 'Coworking Desk', floor: 1, area: 0, capacity: 1,
    type: 'coworking', status: 'available', monthlyPrice: 95000,
    description: 'A flexible hot desk in the ground-floor coworking lounge with access to all shared amenities.',
    features: ['24/7 access', 'Meeting-room credits', 'Unlimited coffee', 'Printing included'],
    photo: 'openspace', featured: false,
  },
  {
    id: 'of-112', code: '06-08', title: 'Corner Cabinet', floor: 6, area: 72, capacity: 8,
    type: 'private-office', status: 'available', monthlyPrice: 1080000,
    description: 'A dual-aspect corner office with excellent light for a team of eight.',
    features: ['Corner aspect', 'Dual exposure', 'Air conditioning', 'Move-in ready'],
    photo: 'office', featured: false,
  },
];

// ===== Meeting rooms =====
export const seedMeetingRooms: MeetingRoom[] = [
  {
    id: 'cr-aspen', name: 'Aspen', capacity: 14, area: 36, hourlyPrice: 12000, floor: 2,
    amenities: ['75" LED display', 'Conference call system', 'Whiteboard', 'Guest Wi-Fi'],
    description: 'An intimate room for working sessions and presentations.', photo: 'meeting',
  },
  {
    id: 'cr-atrium', name: 'Atrium', capacity: 40, area: 86, hourlyPrice: 28000, floor: 3,
    amenities: ['Projector', 'Audio system', '2 wireless mics', 'Coffee-break area'],
    description: 'A mid-size hall for seminars and partner meetings.', photo: 'boardroom',
  },
  {
    id: 'cr-forum', name: 'Forum', capacity: 120, area: 220, hourlyPrice: 65000, floor: 1,
    amenities: ['Stage', 'LED wall', 'Professional sound', 'Green room', 'Catering on request'],
    description: 'A large conference hall for corporate events and conferences.', photo: 'conference',
  },
  {
    id: 'cr-studio', name: 'Studio', capacity: 8, area: 22, hourlyPrice: 7500, floor: 4,
    amenities: ['65" TV', 'Video conferencing', 'Magnetic wall'],
    description: 'A focused room for short meetings and interviews.', photo: 'team',
  },
];

// ===== Tenants =====
export const seedTenants: Tenant[] = [
  {
    id: 't-01', companyName: 'Northwind Capital', industry: 'Finance & Investment', logoText: 'NC',
    floor: 8, officeCode: '08-02', headcount: 34, since: '2022-03-01',
    contactName: 'Marina Klein', contactEmail: 'viewer@crm.kz', phone: '+7 700 000 00 01',
    website: 'https://northwind.example',
    description: 'An investment firm working with corporate and institutional clients across Central Asia.',
    isPublished: true,
  },
  {
    id: 't-02', companyName: 'Aurum Legal', industry: 'Legal Services', logoText: 'AL',
    floor: 6, officeCode: '06-03', headcount: 22, since: '2021-09-15',
    contactName: 'Temirlan Sapayev', contactEmail: 'temir@crm.kz', phone: '+7 700 000 00 02',
    website: 'https://aurum.example',
    description: 'A legal practice specialising in corporate law, M&A and tax advisory.',
    isPublished: true,
  },
  {
    id: 't-03', companyName: 'Helios Engineering', industry: 'Engineering', logoText: 'HE',
    floor: 7, officeCode: '07-01', headcount: 41, since: '2020-06-01',
    contactName: 'Bekzat Orynbek', contactEmail: 'hello@helios.example', phone: '+7 700 000 00 03',
    website: 'https://helios.example',
    description: 'Engineering systems design and construction supervision for commercial projects.',
    isPublished: true,
  },
  {
    id: 't-04', companyName: 'Meridian Audit', industry: 'Audit & Consulting', logoText: 'MA',
    floor: 5, officeCode: '05-02', headcount: 18, since: '2023-01-20',
    contactName: 'Gulnara Iskakova', contactEmail: 'office@meridian.example', phone: '+7 700 000 00 04',
    description: 'Audit, tax and management consulting for mid-market companies.',
    isPublished: true,
  },
  {
    id: 't-05', companyName: 'Studio K8', industry: 'Architecture & Design', logoText: 'K8',
    floor: 4, officeCode: '04-02', headcount: 12, since: '2023-08-05',
    contactName: 'Karim Yusupov', contactEmail: 'studio@k8.example', phone: '+7 700 000 00 05',
    website: 'https://k8.example',
    description: 'An architecture studio focused on commercial interiors and workplace strategy.',
    isPublished: true,
  },
  {
    id: 't-06', companyName: 'Granit Logistics', industry: 'Logistics', logoText: 'GL',
    floor: 3, officeCode: '03-04', headcount: 27, since: '2022-11-11',
    contactName: 'Ruslan Taube', contactEmail: 'team@granit.example', phone: '+7 700 000 00 06',
    description: 'Freight forwarding, customs clearance and warehouse logistics.',
    isPublished: true,
  },
  {
    id: 't-07', companyName: 'Praxis HR', industry: 'HR & Recruitment', logoText: 'PX',
    floor: 5, officeCode: '05-07', headcount: 9, since: '2024-02-01',
    contactName: 'Dana Mukhamejan', contactEmail: 'hello@praxis.example', phone: '+7 700 000 00 07',
    description: 'A recruitment agency and assessment practice for corporate clients.',
    isPublished: true,
  },
  {
    id: 't-08', companyName: 'Volta Media', industry: 'Media & Communications', logoText: 'VM',
    floor: 4, officeCode: '04-06', headcount: 15, since: '2024-05-20',
    contactName: 'Igor Vetrov', contactEmail: 'hello@volta.example', phone: '+7 700 000 00 08',
    website: 'https://volta.example',
    description: 'A communications agency and corporate video production house.',
    isPublished: false,
  },
];

// ===== Leads =====
export const seedLeads: Lead[] = [
  {
    id: 'l-01', name: 'Aibek Serikov', company: 'Serikov Trade', email: 'a.serikov@example.com',
    phone: '+7 701 234 56 78', interest: 'office', message: 'Looking for a 80–100 m² office on floors 5–6.',
    status: 'new', estimatedValue: 1420000, source: 'Website', createdAt: daysAgo(0), notes: [],
    relatedSpaceId: 'of-108',
  },
  {
    id: 'l-02', name: 'Anna Litvinova', company: 'EventPro', email: 'anna@example.com',
    phone: '+7 702 345 67 89', interest: 'meeting-room', message: 'Need a hall for 30 people on the 12th, four hours.',
    status: 'contacted', estimatedValue: 112000, source: 'Referral', createdAt: daysAgo(1),
    notes: [{ id: 'n-1', author: 'Daniyar Akhmetov', text: 'Called back, sent the proposal.', createdAt: daysAgo(1) }],
    relatedSpaceId: 'cr-atrium',
  },
  {
    id: 'l-03', name: 'Bakhyt Zhumabekov', company: 'Nomad Soft', email: 'b.zh@example.com',
    phone: '+7 707 111 22 33', interest: 'office', message: 'Considering open-plan for a team of 18–20.',
    status: 'touring', estimatedValue: 2680000, source: 'Website', createdAt: daysAgo(2), notes: [],
    relatedSpaceId: 'of-105',
  },
  {
    id: 'l-04', name: 'Elena Krasnova', email: 'e.krasnova@example.com',
    phone: '+7 708 222 33 44', interest: 'general', message: 'Would like to rent parking separately from an office.',
    status: 'new', estimatedValue: 0, source: 'Walk-in', createdAt: daysAgo(3), notes: [],
  },
  {
    id: 'l-05', name: 'Dmitry Orlov', company: 'Orlov IT', email: 'orlov@example.com',
    phone: '+7 705 555 66 77', interest: 'office', message: 'Interested in a block on floor 8 or 9 for an IT company.',
    status: 'negotiation', estimatedValue: 3920000, source: 'Referral', createdAt: daysAgo(4),
    notes: [{ id: 'n-2', author: 'Daniyar Akhmetov', text: 'Tour scheduled for Friday.', createdAt: daysAgo(3) }],
    relatedSpaceId: 'of-110',
  },
  {
    id: 'l-06', name: 'Ainur Kasenova', company: 'Kasenova Studio', email: 'kasenova@example.com',
    phone: '+7 700 100 20 30', interest: 'meeting-room', message: 'A small meeting room on a recurring basis.',
    status: 'won', estimatedValue: 90000, source: 'Website', createdAt: daysAgo(7), notes: [],
    relatedSpaceId: 'cr-studio',
  },
  {
    id: 'l-07', name: 'Igor Semenov', email: 'semenov@example.com',
    phone: '+7 776 444 55 66', interest: 'office', message: 'A cabinet for six, ideally floors 3–4.',
    status: 'new', estimatedValue: 780000, source: 'Website', createdAt: daysAgo(5), notes: [],
    relatedSpaceId: 'of-104',
  },
  {
    id: 'l-08', name: 'Sabina Tursynova', email: 's.tursynova@example.com',
    phone: '+7 778 333 22 11', interest: 'coworking', message: 'Two coworking desks for a small remote team.',
    status: 'contacted', estimatedValue: 190000, source: 'Website', createdAt: daysAgo(6), notes: [],
    relatedSpaceId: 'of-111',
  },
  {
    id: 'l-09', name: 'Artur Bekenov', company: 'Bekenov Group', email: 'bekenov@example.com',
    phone: '+7 707 909 09 09', interest: 'office', message: 'Premium upper-floor block with a terrace.',
    status: 'touring', estimatedValue: 3920000, source: 'Referral', createdAt: daysAgo(8), notes: [],
    relatedSpaceId: 'of-110',
  },
  {
    id: 'l-10', name: 'Marie Dubois', company: 'Dubois & Co', email: 'marie@example.com',
    phone: '+7 777 777 77 77', interest: 'general', message: 'Looking for an English-speaking contact regarding leasing.',
    status: 'lost', estimatedValue: 0, source: 'Website', createdAt: daysAgo(12), notes: [],
  },
];

// ===== Bookings =====
export const seedBookings: Booking[] = [
  { id: 'b-01', roomId: 'cr-atrium', tenantId: 't-01', title: 'Quarterly investor briefing', organizer: 'Marina Klein', date: isoDate(0), startTime: '10:00', endTime: '12:00', attendees: 28, status: 'confirmed', createdAt: daysAgo(2) },
  { id: 'b-02', roomId: 'cr-aspen', tenantId: 't-03', title: 'Design review', organizer: 'Bekzat Orynbek', date: isoDate(0), startTime: '14:00', endTime: '15:30', attendees: 9, status: 'confirmed', createdAt: daysAgo(1) },
  { id: 'b-03', roomId: 'cr-forum', title: 'Forum 2026 rehearsal', organizer: 'Sofia Belova', date: isoDate(1), startTime: '09:00', endTime: '13:00', attendees: 80, status: 'pending', createdAt: daysAgo(1) },
  { id: 'b-04', roomId: 'cr-studio', tenantId: 't-02', title: 'Candidate interviews', organizer: 'Temirlan Sapayev', date: isoDate(1), startTime: '11:00', endTime: '13:00', attendees: 4, status: 'confirmed', createdAt: daysAgo(3) },
  { id: 'b-05', roomId: 'cr-aspen', tenantId: 't-04', title: 'Audit kickoff', organizer: 'Gulnara Iskakova', date: isoDate(2), startTime: '16:00', endTime: '17:00', attendees: 8, status: 'confirmed', createdAt: daysAgo(2) },
  { id: 'b-06', roomId: 'cr-atrium', title: 'Tenant town hall', organizer: 'Alexandra Petrova', date: isoDate(3), startTime: '15:00', endTime: '16:30', attendees: 35, status: 'pending', createdAt: daysAgo(1) },
  { id: 'b-07', roomId: 'cr-studio', tenantId: 't-01', title: 'Weekly stand-up', organizer: 'Marina Klein', date: isoDate(2), startTime: '09:30', endTime: '10:00', attendees: 6, status: 'cancelled', createdAt: daysAgo(4) },
];

// ===== Maintenance requests =====
export const seedMaintenance: MaintenanceRequest[] = [
  {
    id: 'm-01', ref: 'MR-1042', tenantId: 't-01', spaceCode: '08-02', category: 'hvac', priority: 'high',
    subject: 'Air conditioning too cold in the east wing',
    description: 'The AC in the east-facing rooms runs very cold in the mornings. Could the setpoint be raised?',
    status: 'in-progress', createdBy: 'Marina Klein', createdAt: daysAgo(1),
    updates: [{ id: 'u-1', author: 'Facilities', text: 'Technician scheduled for tomorrow morning.', createdAt: daysAgo(0) }],
  },
  {
    id: 'm-02', ref: 'MR-1041', tenantId: 't-01', spaceCode: '08-02', category: 'it', priority: 'medium',
    subject: 'Guest Wi-Fi voucher request',
    description: 'We have a partner workshop on Thursday and need 20 guest Wi-Fi vouchers.',
    status: 'resolved', createdBy: 'Marina Klein', createdAt: daysAgo(5),
    updates: [{ id: 'u-2', author: 'IT Desk', text: 'Vouchers issued and emailed.', createdAt: daysAgo(4) }],
  },
  {
    id: 'm-03', ref: 'MR-1040', tenantId: 't-03', spaceCode: '07-01', category: 'electrical', priority: 'urgent',
    subject: 'Flickering lights in reception',
    description: 'Several ceiling panels in the reception area are flickering intermittently.',
    status: 'open', createdBy: 'Bekzat Orynbek', createdAt: daysAgo(0), updates: [],
  },
  {
    id: 'm-04', ref: 'MR-1039', tenantId: 't-02', spaceCode: '06-03', category: 'cleaning', priority: 'low',
    subject: 'Extra cleaning after event',
    description: 'We hosted a client event yesterday and would appreciate an additional cleaning pass.',
    status: 'closed', createdBy: 'Temirlan Sapayev', createdAt: daysAgo(6),
    updates: [{ id: 'u-3', author: 'Facilities', text: 'Completed this morning.', createdAt: daysAgo(5) }],
  },
  {
    id: 'm-05', ref: 'MR-1038', tenantId: 't-04', spaceCode: '05-02', category: 'plumbing', priority: 'medium',
    subject: 'Dripping tap in kitchenette',
    description: 'The cold tap in our kitchenette drips continuously.',
    status: 'in-progress', createdBy: 'Gulnara Iskakova', createdAt: daysAgo(2),
    updates: [{ id: 'u-4', author: 'Facilities', text: 'Replacement cartridge ordered.', createdAt: daysAgo(1) }],
  },
];

// ===== Invoices =====
const month = (offset: number): string =>
  new Date(now + offset * 30 * DAY).toLocaleString('en-US', { month: 'long', year: 'numeric' });

export const seedInvoices: Invoice[] = [
  {
    id: 'inv-01', number: 'INV-2026-0042', tenantId: 't-01', period: month(0),
    issuedAt: daysAgo(8), dueAt: daysAhead(7), status: 'due',
    lines: [
      { label: 'Office 08-02 — monthly rent', amount: 3850000 },
      { label: 'Parking — 6 spaces', amount: 180000 },
      { label: 'Utilities & service charge', amount: 240000 },
    ],
  },
  {
    id: 'inv-02', number: 'INV-2026-0031', tenantId: 't-01', period: month(-1),
    issuedAt: daysAgo(38), dueAt: daysAgo(23), status: 'paid',
    lines: [
      { label: 'Office 08-02 — monthly rent', amount: 3850000 },
      { label: 'Parking — 6 spaces', amount: 180000 },
      { label: 'Utilities & service charge', amount: 232000 },
    ],
  },
  {
    id: 'inv-03', number: 'INV-2026-0020', tenantId: 't-01', period: month(-2),
    issuedAt: daysAgo(68), dueAt: daysAgo(53), status: 'paid',
    lines: [
      { label: 'Office 08-02 — monthly rent', amount: 3850000 },
      { label: 'Meeting room credits — Atrium', amount: 84000 },
      { label: 'Utilities & service charge', amount: 228000 },
    ],
  },
  {
    id: 'inv-04', number: 'INV-2026-0011', tenantId: 't-02', period: month(0),
    issuedAt: daysAgo(20), dueAt: daysAgo(5), status: 'overdue',
    lines: [
      { label: 'Office 06-03 — monthly rent', amount: 2680000 },
      { label: 'Utilities & service charge', amount: 196000 },
    ],
  },
];

// ===== Gallery =====
export const seedGallery: GalleryImage[] = [
  { id: 'g-01', photo: 'facade', title: 'The facade', caption: 'A landmark presence in the city business district.', category: 'architecture' },
  { id: 'g-02', photo: 'lobby', title: 'Main lobby', caption: 'A double-height lobby with reception and waiting area.', category: 'interiors' },
  { id: 'g-03', photo: 'atrium', title: 'Central atrium', caption: 'Natural light and open-floor galleries.', category: 'architecture' },
  { id: 'g-04', photo: 'openspace', title: 'Open-plan workspace', caption: 'A panoramic floor with 22 workstations on level 6.', category: 'interiors' },
  { id: 'g-05', photo: 'conference', title: 'Forum hall', caption: 'Up to 120 guests, stage and professional sound.', category: 'events' },
  { id: 'g-06', photo: 'meeting', title: 'Aspen meeting room', caption: 'An intimate room for fourteen, built for working sessions.', category: 'interiors' },
  { id: 'g-07', photo: 'lounge', title: 'Tenant lounge', caption: 'A space for breaks and informal conversations.', category: 'amenities' },
  { id: 'g-08', photo: 'night', title: 'Rooftop terrace', caption: 'An operable terrace with a city panorama.', category: 'amenities' },
  { id: 'g-09', photo: 'parking', title: 'Underground parking', caption: '180 spaces, car wash and EV charging stations.', category: 'amenities' },
  { id: 'g-10', photo: 'security', title: 'Security desk', caption: 'CCTV, access control and a round-the-clock security team.', category: 'amenities' },
  { id: 'g-11', photo: 'coworking', title: 'Coworking lounge', caption: 'Flexible desks with all shared amenities included.', category: 'interiors' },
  { id: 'g-12', photo: 'team', title: 'Studio room', caption: 'A focused room for interviews and short meetings.', category: 'events' },
];

// ===== News =====
export const seedNews: NewsArticle[] = [
  {
    id: 'n-01', slug: 'new-wing-opens', photo: 'news1', tag: 'Development', author: 'Alexandra Petrova',
    title: 'The new wing opens this quarter',
    excerpt: 'An additional 4,200 m² of lettable space and two conference halls.',
    body: [
      'The new wing features Class-A engineering, a dedicated lift core and a tenant-only parking section. Commissioning is planned for the end of Q2 2026.',
      'Leasing enquiries for the new floors are already open. The wing adds two conference halls, a wellness suite and an expanded coworking lounge to the existing amenities.',
    ],
    publishedAt: daysAgo(2), isPublished: true,
  },
  {
    id: 'n-02', slug: 'resident-line-up-2026', photo: 'news2', tag: 'Community', author: 'Sofia Belova',
    title: 'The 2026 resident line-up',
    excerpt: 'Four new companies have joined the business center.',
    body: [
      'The resident line-up has been joined by legal, engineering and creative-industry firms whose combined teams exceed 120 people.',
      'We welcomed each new resident with an onboarding session and a community breakfast in the tenant lounge.',
    ],
    publishedAt: daysAgo(6), isPublished: true,
  },
  {
    id: 'n-03', slug: 'forum-2026', photo: 'news3', tag: 'Events', author: 'Sofia Belova',
    title: 'Forum 2026 · April 18',
    excerpt: 'An annual gathering of tenants, partners and the city administration.',
    body: [
      'Forum 2026 is a gathering devoted to urban development, commercial real estate and corporate culture. Registration opens early Q2.',
      'The programme includes keynote sessions in the Forum hall, roundtables and a networking reception on the rooftop terrace.',
    ],
    publishedAt: daysAgo(10), isPublished: true,
  },
  {
    id: 'n-04', slug: 'access-control-upgrade', photo: 'security', tag: 'Service', author: 'Daniyar Akhmetov',
    title: 'Access-control system upgrade',
    excerpt: 'New NFC cards and mobile access are now available.',
    body: [
      'NFC card replacement is free for tenants. Guests can be issued temporary access through the mobile app.',
      'The upgraded system adds time-boxed visitor passes and integrates with the meeting-room booking calendar.',
    ],
    publishedAt: daysAgo(15), isPublished: true,
  },
];

// ===== Testimonials =====
export const seedTestimonials: Testimonial[] = [
  { id: 'tst-1', quote: 'Moving in was effortless and the facilities team is genuinely responsive. Our people love coming to the office.', author: 'Marina Klein', role: 'Office Manager', company: 'Northwind Capital' },
  { id: 'tst-2', quote: 'The conference halls have hosted every one of our client events. The production quality is excellent.', author: 'Bekzat Orynbek', role: 'Managing Partner', company: 'Helios Engineering' },
  { id: 'tst-3', quote: 'A genuinely premium address with the service to match. The location speaks for itself with our clients.', author: 'Gulnara Iskakova', role: 'Director', company: 'Meridian Audit' },
];

// ===== Services / amenities =====
export const seedServices: Service[] = [
  { id: 's-1', icon: 'ShieldCheck', title: '24/7 Security', description: 'Round-the-clock security desk, CCTV coverage and managed access control on every floor.' },
  { id: 's-2', icon: 'Car', title: 'Underground Parking', description: '180 spaces with EV charging, a car wash service and priority allocation for tenants.' },
  { id: 's-3', icon: 'Wifi', title: 'Enterprise Connectivity', description: 'Redundant fibre, dedicated tenant VLANs and managed guest Wi-Fi throughout the building.' },
  { id: 's-4', icon: 'Coffee', title: 'Coffee & Lounge', description: 'A ground-floor café and tenant lounges for breaks, informal meetings and events.' },
  { id: 's-5', icon: 'Users', title: 'Conference Halls', description: 'Four bookable rooms from 8 to 120 seats with full AV and optional catering.' },
  { id: 's-6', icon: 'Wrench', title: 'Facilities Management', description: 'An on-site team handling maintenance requests, fit-outs and day-to-day operations.' },
  { id: 's-7', icon: 'Leaf', title: 'Wellness & Terrace', description: 'A rooftop terrace, wellness suite and green breakout spaces for tenant teams.' },
  { id: 's-8', icon: 'Building2', title: 'Reception & Concierge', description: 'A staffed reception managing visitors, deliveries and tenant services.' },
];

// ===== Site settings =====
export const seedSettings: SiteSettings = {
  centerName: 'Meridian Business Center',
  tagline: 'A premium address for modern business',
  address: '55 Mangilik El Avenue',
  city: 'Astana, Kazakhstan',
  phone: '+7 (7172) 70 00 00',
  email: 'office@meridian.kz',
  workingHours: 'Mon–Fri 09:00–19:00 · Sat 10:00–16:00',
  theme: 'blue',
  foundedYear: 2016,
};
