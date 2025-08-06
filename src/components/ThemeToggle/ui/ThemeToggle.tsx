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
        <button onClick={toggleTheme} aria-label={t("Theme.toggle")} className={styles.button}>
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
    );
};

const MemoizedThemeToggle = React.memo(ThemeToggle);

export { MemoizedThemeToggle as ThemeToggle };
