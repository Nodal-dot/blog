"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme/ThemeProvider";
import { useTranslations } from "next-intl";
import styles from "./ThemeToggle.module.scss";

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
            <div className={styles["theme-toggle__container"]}>
                <div className={styles["theme-toggle__icons"]}>
                    <Sun size={18} className={styles["theme-toggle__icon"]} />
                    <Moon size={18} className={styles["theme-toggle__icon"]} />
                </div>
                <div className={styles["theme-toggle__thumb"]} />
            </div>
        </button>
    );
};

export const MemoizedThemeToggle = React.memo(ThemeToggle);
