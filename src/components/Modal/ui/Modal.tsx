"use client";

import React, { type FC } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import { classNames } from "@/utils/classNames";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const Modal: FC<ModalProps> = (props) => {
    const { open, onClose, children, title, description } = props;
    const [mounted, setMounted] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!mounted) return null;

    const titleId = title ? "modal-title" : undefined;
    const descId = description ? "modal-description" : undefined;

    return createPortal(
        <div
            className={classNames(styles.modal__backdrop, {
                [styles["modal__backdrop--visible"]]: open,
            })}
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className={classNames(styles.modal__content, {
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
                    className={styles.modal__close}
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export const MemoizedModal = React.memo(Modal);
