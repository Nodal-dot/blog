"use client";

import React from "react";
import { usePathname } from "@/i18n/navigation";
import { usePageTransition } from "@/providers/transition/PageTransitionProvider";
import styles from "./Navigation.module.scss";
import NavLink from "@/components/NavLink";
import { classNames } from "@/utils/classNames";

interface NavProps {
    links: Array<{ href: string; label: string }>;
}

const Navigation: React.FC<NavProps> = ({ links }) => {
    const pathname = usePathname();
    const { startTransition } = usePageTransition();

    return (
        <nav className={classNames(styles.nav)} aria-label="Main navigation">
            <ul className={classNames(styles.list)}>
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

export const MemoizedNavigation = React.memo(Navigation);
