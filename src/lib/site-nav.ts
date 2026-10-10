// Navigation data for the shell (docs/routes-and-sitemap.md). The
// site-nav test asserts every href here is a real route in that doc.

export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  {label: "Shop", href: "/shop"},
  {label: "Seminars", href: "/seminars"},
  {label: "Learn", href: "/learn"},
  {label: "Stories", href: "/stories"},
  {label: "About", href: "/about"},
  {label: "Contact", href: "/contact"},
];

export const mobileNav: NavLink[] = [
  {label: "Shop", href: "/shop"},
  {label: "Seminars", href: "/seminars"},
  {label: "Learn", href: "/learn"},
  {label: "Customer stories", href: "/stories"},
  {label: "Business opportunity", href: "/business-opportunity"},
  {label: "Refer a friend", href: "/refer"},
  {label: "About us", href: "/about"},
  {label: "FAQ", href: "/faq"},
  {label: "Contact", href: "/contact"},
];

export const legalLinks: NavLink[] = [
  {label: "Privacy policy", href: "/privacy"},
  {label: "Terms of use", href: "/terms"},
  {label: "Health disclaimer", href: "/health-disclaimer"},
  {label: "Delivery & returns", href: "/delivery-and-returns"},
];

export const footerColumns: {title: string; links: NavLink[]}[] = [
  {
    title: "Learn & events",
    links: [
      {label: "Seminars", href: "/seminars"},
      {label: "Learn", href: "/learn"},
      {label: "Customer stories", href: "/stories"},
    ],
  },
  {
    title: "Company",
    links: [
      {label: "About us", href: "/about"},
      {label: "Business opportunity", href: "/business-opportunity"},
      {label: "Refer a friend", href: "/refer"},
      {label: "FAQ", href: "/faq"},
      {label: "Contact", href: "/contact"},
    ],
  },
  {title: "Legal", links: legalLinks},
];

// A nav item is current on an exact match; Shop also covers product pages
// and Learn covers article pages.
const prefixMap: Record<string, string[]> = {
  "/shop": ["/shop", "/products"],
  "/learn": ["/learn"],
};

export function isNavActive(href: string, pathname: string): boolean {
  const prefixes = prefixMap[href] ?? [href];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
