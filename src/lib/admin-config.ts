/* ------------------------------------------------------------------ */
/*  Admin CMS configuration — drives the generic CRUD interface        */
/* ------------------------------------------------------------------ */

export type FieldType =
  | "text"
  | "textarea"
  | "paragraphs" // multi-paragraph text stored as \n-separated string
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "list" // string[] — one item per line
  | "objectlist" // {label,url}-style objects
  | "json"; // read-only pretty display

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  optionsFrom?: "programs" | "projects"; // dynamic select source
  subfields?: { key: string; label: string }[]; // for objectlist
  placeholder?: string;
  help?: string;
  half?: boolean; // render at half width
}

export interface ResourceConfig {
  key: string;
  label: string;
  singular: string;
  icon: string;
  group: "Content" | "Community" | "Commerce" | "Configuration";
  singleton?: boolean;
  hideCreate?: boolean;
  titleField: string;
  subtitleField?: string;
  columns: string[];
  fields: FieldConfig[];
  description?: string;
}

const PUBLISHED: FieldConfig = { key: "published", label: "Published", type: "boolean", half: true };

export const RESOURCES: ResourceConfig[] = [
  {
    key: "homepage",
    label: "Homepage",
    singular: "Homepage",
    icon: "dashboard",
    group: "Configuration",
    singleton: true,
    titleField: "heroTitleTop",
    columns: [],
    description: "All hero, section copy and imagery shown on the homepage.",
    fields: [
      { key: "heroKicker", label: "Hero kicker", type: "text", half: true },
      { key: "heroImage", label: "Hero background image", type: "image" },
      { key: "heroTitleTop", label: "Hero title (line 1)", type: "text", half: true },
      { key: "heroTitleAccent", label: "Hero title accent (line 2)", type: "text", half: true },
      { key: "heroSubtitle", label: "Hero supporting text", type: "textarea" },
      {
        key: "heroTaglineItems",
        label: "Hero commitment chips",
        type: "list",
        help: "One item per line",
      },
      { key: "whoWeAreHeading", label: "'Who we are' heading", type: "text" },
      { key: "whoWeAreBody", label: "'Who we are' body", type: "paragraphs" },
      { key: "whoWeAreImage", label: "'Who we are' image", type: "image" },
      {
        key: "featuredProjectSlug",
        label: "Featured initiative",
        type: "select",
        optionsFrom: "projects",
      },
      { key: "sustainabilityHeading", label: "Sustainability heading", type: "text" },
      { key: "sustainabilityBody", label: "Sustainability body", type: "paragraphs" },
      { key: "volunteerCtaHeading", label: "Volunteer CTA heading", type: "text" },
      { key: "volunteerCtaBody", label: "Volunteer CTA body", type: "textarea" },
      { key: "volunteerCtaImage", label: "Volunteer CTA image", type: "image" },
      { key: "newsletterHeading", label: "Newsletter heading", type: "text" },
      { key: "newsletterBody", label: "Newsletter body", type: "textarea" },
    ],
  },
  {
    key: "stats",
    label: "Impact Statistics",
    singular: "Statistic",
    icon: "trending-up",
    group: "Content",
    titleField: "label",
    columns: ["label", "value", "suffix"],
    description: "The animated numbers shown on the homepage and impact page.",
    fields: [
      { key: "label", label: "Label", type: "text", required: true, half: true },
      { key: "value", label: "Number", type: "number", required: true, half: true },
      { key: "suffix", label: "Suffix (e.g. +)", type: "text", half: true },
      { key: "order", label: "Display order", type: "number", half: true },
      { key: "note", label: "Small note (optional)", type: "text" },
    ],
  },
  {
    key: "programs",
    label: "Programs",
    singular: "Program",
    icon: "heart-pulse",
    group: "Content",
    titleField: "name",
    subtitleField: "summary",
    columns: ["name", "slug", "order", "published"],
    fields: [
      { key: "name", label: "Program name", type: "text", required: true, half: true },
      { key: "slug", label: "URL slug", type: "text", half: true, help: "Leave blank to auto-generate" },
      {
        key: "icon",
        label: "Icon",
        type: "select",
        half: true,
        options: [
          "heart-pulse",
          "book-open",
          "wheat",
          "spark",
          "home-heart",
          "life-buoy",
          "users",
          "leaf",
          "sun",
          "handshake",
        ],
      },
      { key: "order", label: "Display order", type: "number", half: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "image", label: "Card image", type: "image", required: true },
      { key: "objectives", label: "Objectives", type: "list" },
      { key: "activities", label: "Activities", type: "list" },
      { key: "impactSummary", label: "Impact summary quote", type: "textarea" },
      {
        key: "overview",
        label: "Overview (long-form context)",
        type: "paragraphs",
        help: "Why this program exists, the need it meets, and how it fits our mission. Shown on the program page.",
      },
      { key: "whoWeServe", label: "Who we serve", type: "textarea" },
      { key: "outcomes", label: "Long-term outcomes", type: "list" },
      {
        key: "faq",
        label: "Program FAQs",
        type: "objectlist",
        subfields: [
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer" },
        ],
      },
      { key: "currentProjects", label: "Current projects", type: "list" },
      { key: "gallery", label: "Gallery images (links or uploads)", type: "list" },
      PUBLISHED,
    ],
  },
  {
    key: "projects",
    label: "Projects",
    singular: "Project",
    icon: "target",
    group: "Content",
    titleField: "name",
    subtitleField: "location",
    columns: ["name", "location", "progressPercent", "status", "featured"],
    fields: [
      { key: "name", label: "Project name", type: "text", required: true, half: true },
      { key: "slug", label: "URL slug", type: "text", half: true, help: "Leave blank to auto-generate" },
      { key: "location", label: "Location", type: "text", half: true },
      {
        key: "programId",
        label: "Linked program",
        type: "select",
        half: true,
        optionsFrom: "programs",
      },
      { key: "summary", label: "Summary line", type: "textarea", required: true },
      { key: "description", label: "Full description", type: "paragraphs" },
      { key: "image", label: "Cover image", type: "image", required: true },
      { key: "gallery", label: "Gallery images (links or uploads)", type: "list" },
      { key: "peopleReached", label: "People reached", type: "number", half: true },
      { key: "progressPercent", label: "Progress %", type: "number", half: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        half: true,
        options: ["planning", "active", "completed"],
      },
      { key: "startDate", label: "Start date (YYYY-MM)", type: "text", half: true },
      { key: "featured", label: "Featured project", type: "boolean", half: true },
      PUBLISHED,
    ],
  },
  {
    key: "stories",
    label: "Stories",
    singular: "Story",
    icon: "quote",
    group: "Content",
    titleField: "title",
    subtitleField: "location",
    columns: ["title", "category", "location", "publishedAt", "sample"],
    description:
      "Publish community stories only with informed consent. Keep the 'Illustrative' flag on until a story is verified.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, half: true },
      { key: "slug", label: "URL slug", type: "text", half: true, help: "Leave blank to auto-generate" },
      { key: "category", label: "Category", type: "text", half: true },
      { key: "location", label: "Location", type: "text", half: true },
      { key: "personName", label: "Person/community name (with consent)", type: "text", half: true },
      { key: "publishedAt", label: "Publish date (YYYY-MM-DD)", type: "text", half: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { key: "body", label: "Story body", type: "paragraphs" },
      { key: "impactAchieved", label: "Impact achieved", type: "text" },
      { key: "image", label: "Story image", type: "image", required: true },
      { key: "sample", label: "Mark as illustrative example", type: "boolean", half: true },
      PUBLISHED,
    ],
  },
  {
    key: "team",
    label: "Team Members",
    singular: "Team member",
    icon: "users",
    group: "Content",
    titleField: "name",
    subtitleField: "role",
    columns: ["name", "role", "order"],
    description: "Only real, verified profiles should be added here.",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true, half: true },
      { key: "role", label: "Role / title", type: "text", required: true, half: true },
      { key: "photo", label: "Photo", type: "image" },
      { key: "bio", label: "Short bio", type: "textarea" },
      { key: "order", label: "Display order", type: "number", half: true },
    ],
  },
  {
    key: "partners",
    label: "Partners",
    singular: "Partner",
    icon: "handshake",
    group: "Content",
    titleField: "name",
    columns: ["name", "url"],
    description: "Add partner logos only with written permission.",
    fields: [
      { key: "name", label: "Organization name", type: "text", required: true, half: true },
      { key: "url", label: "Website", type: "text", half: true },
      { key: "logo", label: "Logo", type: "image" },
      { key: "description", label: "Partnership summary", type: "textarea" },
    ],
  },
  {
    key: "events",
    label: "Events",
    singular: "Event",
    icon: "calendar",
    group: "Content",
    titleField: "title",
    columns: ["title", "date", "location", "published"],
    fields: [
      { key: "title", label: "Event title", type: "text", required: true, half: true },
      { key: "date", label: "Date (YYYY-MM-DD)", type: "text", required: true, half: true },
      { key: "location", label: "Location", type: "text", half: true },
      PUBLISHED,
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  {
    key: "reports",
    label: "Reports & Policies",
    singular: "Document",
    icon: "file-text",
    group: "Configuration",
    titleField: "title",
    columns: ["title", "category", "year"],
    description:
      "Documents listed here appear in the Transparency centre. Add a public URL once a document is ready for download.",
    fields: [
      { key: "title", label: "Document title", type: "text", required: true, half: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        half: true,
        options: ["Annual Report", "Financial Report", "Project Report", "Policy", "Governance", "Registration"],
      },
      { key: "year", label: "Year", type: "text", half: true },
      { key: "availableOnRequest", label: "Available on request", type: "boolean", half: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "url", label: "Public download URL (when ready)", type: "text" },
    ],
  },
  {
    key: "products",
    label: "Shop Products",
    singular: "Product",
    icon: "shopping-bag",
    group: "Commerce",
    titleField: "name",
    columns: ["name", "priceKes", "inStock", "featured"],
    fields: [
      { key: "name", label: "Product name", type: "text", required: true, half: true },
      { key: "slug", label: "URL slug", type: "text", half: true, help: "Leave blank to auto-generate" },
      { key: "priceKes", label: "Price (KES)", type: "number", required: true, half: true },
      { key: "priceUsd", label: "Price (USD) — shown outside Kenya", type: "number", half: true },
      { key: "inStock", label: "In stock", type: "boolean", half: true },
      { key: "featured", label: "Featured", type: "boolean", half: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Product image", type: "image", required: true },
      { key: "sizes", label: "Sizes", type: "list", help: "One per line, e.g. S / M / L" },
      { key: "colors", label: "Colors", type: "list" },
    ],
  },
  {
    key: "enquiries",
    label: "Contact Enquiries",
    singular: "Enquiry",
    icon: "inbox",
    group: "Community",
    hideCreate: true,
    titleField: "subject",
    subtitleField: "email",
    columns: ["subject", "name", "email", "handled"],
    description: "Messages submitted through the contact form.",
    fields: [
      { key: "name", label: "From", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "handled", label: "Handled", type: "boolean" },
    ],
  },
  {
    key: "chats",
    label: "Chat Messages",
    singular: "Chat message",
    icon: "send",
    group: "Community",
    hideCreate: true,
    titleField: "message",
    subtitleField: "email",
    columns: ["name", "email", "message", "status"],
    description: "Messages sent through the floating chat widget.",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "page", label: "Page", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["new", "replied"],
      },
    ],
  },
  {
    key: "subscribers",
    label: "Newsletter Subscribers",
    singular: "Subscriber",
    icon: "mail",
    group: "Community",
    hideCreate: true,
    titleField: "email",
    subtitleField: "name",
    columns: ["name", "email", "confirmed"],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "confirmed", label: "Confirmed", type: "boolean" },
    ],
  },
  {
    key: "volunteers",
    label: "Volunteer Applications",
    singular: "Application",
    icon: "user",
    group: "Community",
    hideCreate: true,
    titleField: "name",
    subtitleField: "skills",
    columns: ["name", "skills", "availability", "status"],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "skills", label: "Skills", type: "textarea" },
      { key: "availability", label: "Availability", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["new", "in-review", "onboarded", "declined"],
      },
    ],
  },
  {
    key: "donations",
    label: "Donations",
    singular: "Donation",
    icon: "gift",
    group: "Community",
    hideCreate: true,
    titleField: "donorName",
    subtitleField: "reference",
    columns: ["donorName", "amountKes", "currency", "frequency", "status", "reference"],
    description:
      "Giving intentions. Mark 'confirmed' ONLY after payment has been verified by your provider or bank.",
    fields: [
      { key: "donorName", label: "Donor", type: "text" },
      { key: "amountKes", label: "Amount (in currency)", type: "number" },
      { key: "currency", label: "Currency", type: "select", options: ["KES", "USD"] },
      { key: "frequency", label: "Frequency", type: "select", options: ["once", "monthly"] },
      { key: "projectSlug", label: "Designated project", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "anonymous", label: "Anonymous", type: "boolean" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "reference", label: "Reference", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["pending", "confirmed", "failed"],
      },
    ],
  },
  {
    key: "orders",
    label: "Shop Orders",
    singular: "Order",
    icon: "package",
    group: "Commerce",
    hideCreate: true,
    titleField: "customerName",
    subtitleField: "deliveryAddress",
    columns: ["customerName", "totalKes", "status"],
    fields: [
      { key: "customerName", label: "Customer", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "deliveryAddress", label: "Delivery address", type: "textarea" },
      { key: "items", label: "Items", type: "json" },
      { key: "totalKes", label: "Total (KES)", type: "number" },
      { key: "notes", label: "Notes", type: "textarea" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["new", "confirmed", "fulfilled", "cancelled"],
      },
    ],
  },
  {
    key: "settings",
    label: "Site Settings",
    singular: "Settings",
    icon: "settings",
    group: "Configuration",
    singleton: true,
    titleField: "orgName",
    columns: [],
    description: "Organization identity, contact addresses and social links.",
    fields: [
      { key: "orgName", label: "Organization name", type: "text", required: true, half: true },
      { key: "tagline", label: "Tagline", type: "text", half: true },
      { key: "missionShort", label: "Short mission statement", type: "textarea" },
      { key: "emailGeneral", label: "General email", type: "text", half: true },
      { key: "emailPartnerships", label: "Partnerships email", type: "text", half: true },
      { key: "emailPrograms", label: "Programs email", type: "text", half: true },
      { key: "phone", label: "Phone (leave empty to hide)", type: "text", half: true },
      { key: "location", label: "Location", type: "text", half: true },
      { key: "deliveryFeeKes", label: "Delivery fee (KES)", type: "number", half: true },
      {
        key: "deliveryFeeUsd",
        label: "Delivery fee (USD)",
        type: "number",
        half: true,
        help: "Shown to visitors outside Kenya",
      },
      { key: "registrationNote", label: "Registration note", type: "textarea" },
      {
        key: "socials",
        label: "Social media links",
        type: "objectlist",
        subfields: [
          { key: "label", label: "Platform" },
          { key: "url", label: "URL (empty = coming soon)" },
        ],
        help: "Supported platforms: Facebook, Instagram, X, LinkedIn, YouTube",
      },
    ],
  },
];

export function getResource(key: string): ResourceConfig | undefined {
  return RESOURCES.find((r) => r.key === key);
}
