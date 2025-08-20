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
            className={`${styles.button} ${theme === "dark" ? styles.dark : ""}`}
            data-theme={theme}
        >
            <div className={styles.toggleContainer}>
                <div className={styles.icons}>
                    <Sun size={18} className={styles.sun} />
                    <Moon size={18} className={styles.moon} />
                </div>
                <div className={styles.thumb} />
            </div>
        </button>
    );
};

export const MemoizedThemeToggle = React.memo(ThemeToggle);
