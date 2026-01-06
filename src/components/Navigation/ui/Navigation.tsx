"use client";

import React, { type FC } from "react";
import { usePathname } from "@/i18n/navigation";
import { usePageTransition } from "@/providers/transition/PageTransitionProvider";
import styles from "./Navigation.module.scss";
import Link from "@/components/Link";
import { classNames } from "@/utils/classNames";

interface NavigationProps {
    links: Array<{ href: string; label: string }>;
}

export const Navigation: FC<NavigationProps> = (props) => {
    const { links } = props;
    const pathname = usePathname();
    const { startTransition } = usePageTransition();
    return (
        <nav className={classNames(styles.navigation)} aria-label="Main navigation">
            <ul className={classNames(styles["navigation__list"])}>
                {links.map(({ href, label }) => (
                    <li key={href}>
                        <Link
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
