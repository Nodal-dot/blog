"use client";

import React from "react";
import { createPortal } from "react-dom";
import * as focusTrap from "focus-trap";
import styles from "./Modal.module.scss";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
    const [mounted, setMounted] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);
    const trapRef = React.useRef<focusTrap.FocusTrap | null>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) {
            document.addEventListener("keydown", onKeyDown);
        }
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    React.useEffect(() => {
        if (open && modalRef.current) {
            trapRef.current = focusTrap.createFocusTrap(modalRef.current, {
                escapeDeactivates: true,
                clickOutsideDeactivates: true,
                returnFocusOnDeactivate: true,
                fallbackFocus: modalRef.current,
            });
            trapRef.current.activate();
        } else {
            trapRef.current?.deactivate();
            trapRef.current = null;
        }

        return () => {
            trapRef.current?.deactivate();
            trapRef.current = null;
        };
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <div className={`${styles.backdrop} ${open ? styles.show : ""}`} onClick={onClose}>
            <div
                ref={modalRef}
                className={`${styles.modal} ${open ? styles.show : ""}`}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles["close-button"]}
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
