"use client";

import React, { type FC } from "react";
import styles from "./MobileMenu.module.scss";
import Link from "@/shared/ui/Link";
import { usePathname } from "@/i18n/navigation";
import Modal from "@/shared/ui/Modal";
import { useModal } from "@/hooks/modal";
import { usePageTransition } from "@/app/providers/transition";

interface MobileMenuProps {
    links: { href: string; label: string }[];
}

export const MobileMenu: FC<MobileMenuProps> = (props) => {
    const { links } = props;
    const { open, toggleModal, closeModal } = useModal();
    const pathname = usePathname();
    const { startTransition } = usePageTransition();

    return (
        <div className={styles["mobile-menu"]}>
            <button
                onClick={toggleModal}
                aria-expanded={open}
                aria-label={"Открыть меню"}
                className={`${styles["mobile-menu__trigger"]}`}
            >
                <span className={styles["mobile-menu__line"]} />
                <span className={styles["mobile-menu__line"]} />
                <span className={styles["mobile-menu__line"]} />
            </button>

            <Modal open={open} onClose={closeModal}>
                <nav className={styles["mobile-menu__nav"]}>
                    {links.map(({ href, label }) => (
                        <Link
                            href={href}
                            label={label}
                            key={label}
                            isActive={pathname === href}
                            onClick={() => {
                                startTransition(href);
                                closeModal();
                            }}
                        />
                    ))}
                </nav>
            </Modal>
        </div>
    );
};
