type NavItem = { href: string; labelKey: string };

export function getNavigationsLinks(): NavItem[] {
    return [
        { href: `/`, labelKey: "Nav.home" },
        { href: `/about`, labelKey: "Nav.about" },
        { href: `/posts`, labelKey: "Nav.posts" },
    ];
}

export const NAV_LINKS_KEYS = ["Nav.home", "Nav.about", "Nav.posts"] as const;
