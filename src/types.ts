/* ------------------------------------------------------------------ */
/*  Hands of Hope Foundation — shared content types                    */
/* ------------------------------------------------------------------ */

export interface SiteSettings {
  orgName: string;
  tagline: string;
  missionShort: string;
  emailGeneral: string;
  emailPartnerships: string;
  emailPrograms: string;
  phone: string;
  location: string;
  deliveryFeeKes: number;
  deliveryFeeUsd: number;
  registrationNote: string;
  socials: { label: string; url: string }[];
}

export interface Homepage {
  heroKicker: string;
  heroTitleTop: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroImage: string;
  heroTaglineItems: string[];
  whoWeAreHeading: string;
  whoWeAreBody: string;
  whoWeAreImage: string;
  featuredProjectSlug: string;
  sustainabilityHeading: string;
  sustainabilityBody: string;
  sustainabilityImage: string;
  volunteerCtaHeading: string;
  volunteerCtaBody: string;
  volunteerCtaImage: string;
  newsletterHeading: string;
  newsletterBody: string;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  note?: string;
  order: number;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  icon: string; // icon key from Icon component
  summary: string;
  image: string;
  objectives: string[];
  activities: string[];
  impactSummary: string;
  currentProjects: string[];
  gallery: string[];
  published: boolean;
  order: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  programId?: string;
  summary: string;
  description: string;
  location: string;
  image: string;
  gallery: string[];
  peopleReached: number;
  progressPercent: number;
  status: "active" | "planning" | "completed";
  featured: boolean;
  startDate?: string;
  published: boolean;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[]; // paragraphs
  image: string;
  location: string;
  personName?: string;
  impactAchieved: string;
  category: string;
  sample?: boolean; // illustrative content pending verified, consented story
  publishedAt: string;
  published: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  order: number;
}

export interface Partner {
  id: string;
  name: string;
  url?: string;
  logo?: string;
  description?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  published: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceKes: number;
  priceUsd?: number;
  image: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured: boolean;
}

export interface ReportDoc {
  id: string;
  title: string;
  category: "Annual Report" | "Financial Report" | "Project Report" | "Policy" | "Governance" | "Registration";
  year?: string;
  url?: string; // link to hosted PDF when available
  description: string;
  availableOnRequest?: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  handled: boolean;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  confirmed: boolean;
}

export interface VolunteerApp {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string;
  availability: string;
  message?: string;
  createdAt: string;
  status: "new" | "in-review" | "onboarded" | "declined";
}

export interface DonationIntent {
  id: string;
  amountKes: number;
  frequency: "once" | "monthly";
  projectSlug?: string;
  donorName: string;
  email: string;
  phone?: string;
  anonymous: boolean;
  message?: string;
  provider: string; // e.g. "pending-manual", "mpesa", "stripe"
  reference: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
}

export interface ShopOrder {
  id: string;
  currency: "KES" | "USD";
  items: { productId: string; name: string; priceKes: number; priceUsd?: number; size?: string; color?: string; qty: number }[];
  deliveryFeeKes: number;
  totalKes: number;
  deliveryFeeUsd?: number;
  totalUsd?: number;
  customerName: string;
  email: string;
  phone?: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  status: "new" | "confirmed" | "fulfilled" | "cancelled";
}

export interface ChatMessage {
  id: string;
  name?: string;
  email?: string;
  page: string;
  message: string;
  createdAt: string;
  status: "new" | "replied";
}

export interface DatabaseShape {
  settings: SiteSettings;
  homepage: Homepage;
  stats: Stat[];
  programs: Program[];
  projects: Project[];
  stories: Story[];
  team: TeamMember[];
  partners: Partner[];
  events: EventItem[];
  products: Product[];
  reports: ReportDoc[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
  volunteers: VolunteerApp[];
  donations: DonationIntent[];
  orders: ShopOrder[];
  chats: ChatMessage[];
}
