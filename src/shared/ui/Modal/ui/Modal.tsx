"use client";

import React, { useEffect, type FC } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { Icon } from "@/shared/ui/Icon";
import { useTranslations } from "next-intl";
interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const Modal: FC<ModalProps> = (props) => {
    const { open, onClose, children, title, description } = props;
    const t = useTranslations("Modal");
    const [mounted, setMounted] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (open) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [open]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!mounted || !open) return null;

    const titleId = title ? "modal-title" : undefined;
    const descId = description ? "modal-description" : undefined;

    return createPortal(
        <div
            className={classNames(styles["modal__backdrop"], {
                [styles["modal__backdrop--visible"]]: open,
            })}
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className={classNames(styles["modal__content"], {
                    [styles["modal__content--open"]]: open,
                })}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h2 id={titleId}>{title}</h2>}
                {description && <p id={descId}>{description}</p>}

                <button
                    type="button"
                    className={styles["modal__close"]}
                    onClick={onClose}
                    aria-label={t("close")}
                >
                    <Icon name="x" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export const MemoizedModal = React.memo(Modal);
