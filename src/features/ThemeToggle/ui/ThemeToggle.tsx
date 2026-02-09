"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./ThemeToggle.module.scss";
import { useTheme } from "@/app/providers/theme";

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const t = useTranslations();

    return (
        <button
            onClick={toggleTheme}
            aria-label={t("Theme.toggle")}
            className={`${styles["theme-toggle"]} ${theme === "dark" ? styles["theme-toggle--dark"] : ""}`}
            data-theme={theme}
        >
            <span className={styles["theme-toggle__container"]}>
                <span className={styles["theme-toggle__icons"]} aria-hidden>
                    <Sun size={18} className={styles["theme-toggle__icon"]} />
                    <Moon size={18} className={styles["theme-toggle__icon"]} />
                </span>
                <span className={styles["theme-toggle__thumb"]} aria-hidden />
            </span>
        </button>
    );
};

export const MemoizedThemeToggle = React.memo(ThemeToggle);
