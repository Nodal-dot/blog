"use client";

import React from "react";
import { usePathname } from "@/i18n/navigation";
import { usePageTransition } from "@/providers/transition/PageTransitionProvider";
import styles from "./Navigation.module.scss";
import NavLink from "@/components/NavLink";

interface NavProps {
    links: Array<{ href: string; label: string }>;
}

const Navigation: React.FC<NavProps> = ({ links }) => {
    const pathname = usePathname();
    const { startTransition } = usePageTransition();

    return (
        <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.list}>
                {links.map(({ href, label }) => (
                    <li key={href}>
                        <NavLink
                            href={href}
                            label={label}
                            isActive={pathname === href}
                            onClick={() => startTransition(href)}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};
const MemoizedNavigation = React.memo(Navigation);

export { MemoizedNavigation as Navigation };
