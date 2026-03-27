"use client";

import React, { type FC } from "react";
import styles from "./MobileMenu.module.scss";
import Link from "@/shared/ui/Link";
import { usePathname } from "@/shared/i18n/navigation";
import Modal, { useModal } from "@/shared/ui/Modal";
import { usePageTransition } from "@/app/providers/transition";
import { classNames } from "@/shared/lib/classNames";

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
                className={classNames(`${styles["mobile-menu__trigger"]}`, {
                    [styles["mobile-menu__trigger--active"]]: open,
                })}
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
