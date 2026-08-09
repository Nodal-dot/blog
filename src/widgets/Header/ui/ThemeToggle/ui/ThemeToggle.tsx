"use client";

import React, { useSyncExternalStore } from "react";
import { Icon } from "@/shared/ui/Icon";
import { useTranslations } from "next-intl";
import styles from "./ThemeToggle.module.scss";
import { useTheme } from "@/app/providers/theme";

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const ThemeToggle: React.FC = () => {
    const { theme, systemTheme, preference, toggleTheme } = useTheme();
    const t = useTranslations();
    const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

    if (!isMounted) return null;

    const nextTheme = theme === "light" ? "dark" : "light";
    const returnsToSystem = preference !== "system" && nextTheme === systemTheme;
    const actionLabel = returnsToSystem ? t(`Theme.backTo.${nextTheme}`) : t(`Theme.switchTo.${nextTheme}`);

    return (
        <button
            onClick={toggleTheme}
            aria-label={actionLabel}
            title={actionLabel}
            className={`${styles["theme-toggle"]} ${theme === "dark" ? styles["theme-toggle--dark"] : ""}`}
            data-theme={theme}
            data-preference={preference}
        >
            <span className={styles["theme-toggle__container"]}>
                <span className={styles["theme-toggle__icons"]} aria-hidden>
                    <Icon name="sun" size={18} className={styles["theme-toggle__icon"]} />
                    <Icon name="moon" size={18} className={styles["theme-toggle__icon"]} />
                </span>
                <span className={styles["theme-toggle__thumb"]} aria-hidden />
            </span>
        </button>
    );
};

export const MemoizedThemeToggle = React.memo(ThemeToggle);
