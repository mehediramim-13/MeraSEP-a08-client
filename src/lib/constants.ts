export const SITE = {
  name: "MeraSEP",
  tagline: "Your community. Your cause. Your move.",
  description:
    "MeraSEP is a community platform where people in Bangladesh create, join and track social service events — cleanups, plantation drives, donation runs, health camps and more.",
  contact: {
    address: "House 42, Road 11, Banani, Dhaka 1213, Bangladesh",
    phone: "+880 1711 204 588",
    email: "hello@merasep.org",
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
];

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Our impact", href: "/#impact" },
  { label: "FAQ", href: "/#faq" },
];

export const FOOTER_INVOLVED_LINKS: NavLink[] = [
  { label: "Create an event", href: "/create-event" },
  { label: "Manage my events", href: "/manage-events" },
  { label: "Events I joined", href: "/joined-events" },
  { label: "My profile", href: "/profile" },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/merasep" },
  { label: "X", href: "https://x.com/merasep" },
  { label: "Instagram", href: "https://www.instagram.com/merasep" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/merasep" },
  { label: "YouTube", href: "https://www.youtube.com/@merasep" },
] as const;

export const IMPACT_STATS = [
  { value: 320, suffix: "+", label: "Events held", detail: "Since our first cleanup in 2023" },
  { value: 2400, suffix: "+", label: "Volunteers", detail: "Across 18 districts of Bangladesh" },
  { value: 18, suffix: "", label: "Cities & towns", detail: "From Panchagarh to Cox's Bazar" },
  { value: 46500, suffix: "+", label: "People helped", detail: "Warm clothes, meals, books and care" },
] as const;

export const PARTNER_NAMES = [
  "Prottasha Foundation",
  "Amar Gram",
  "Green Roots BD",
  "Uttoron Collective",
  "Coastal Care",
  "Shobuj Bangla",
  "Nodi Bachao",
  "Dhaka Youth Circle",
] as const;

export const SAVED_EVENTS_STORAGE_KEY = "merasep:saved-events:v1";
