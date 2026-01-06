type NavItem = { href: string; labelKey: string };

export function getNavigationsLinks(): NavItem[] {
    return [
        { href: `/`, labelKey: "Nav.home" },
        { href: `/about`, labelKey: "Nav.about" },
        { href: `/blog`, labelKey: "Nav.blog" },
    ];
}

export const NAV_LINKS_KEYS = ["Nav.home", "Nav.about", "Nav.blog"] as const;
