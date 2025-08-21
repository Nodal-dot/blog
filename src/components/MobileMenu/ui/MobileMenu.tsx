"use client";

import React from "react";
import styles from "./MobileMenu.module.scss";

interface MobileMenuProps {
    links: { href: string; label: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ links }) => {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const toggleMenu = () => setOpen((p) => !p);

    React.useEffect(() => {
        if (open && menuRef.current) {
            const focusable = menuRef.current.querySelector<HTMLElement>(
                "a, button, input, [tabindex]:not([tabindex='-1'])"
            );
            focusable?.focus();
        }
    }, [open]);

    return (
        <div className={styles["mobile-menu"]}>
            <button
                onClick={toggleMenu}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Закрыть меню" : "Открыть меню"}
                className={`${styles.burger} ${open ? styles.open : ""}`}
            >
                <span className={styles.line} />
                <span className={styles.line} />
                <span className={styles.line} />
            </button>

            <div
                ref={menuRef}
                id="mobile-nav"
                className={`${styles.modal} ${open ? styles.show : ""}`}
                role="dialog"
                aria-modal="true"
            >
                <nav className={styles.nav}>
                    {links.map((link) => (
                        <a key={link.href} href={link.href} className={styles.navLink}>
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export const MemoizedMobileMenu = React.memo(MobileMenu);
