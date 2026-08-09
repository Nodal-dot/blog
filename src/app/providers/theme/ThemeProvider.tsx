"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface IThemeContextProps {
    theme: Theme;
    systemTheme: Theme;
    preference: ThemePreference;
    toggleTheme: () => void;
}

const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getSystemTheme = (): Theme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
};

const getStoredTheme = (): Theme | null => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
};

const resolveTheme = (storedTheme: Theme | null, systemTheme: Theme): Theme =>
    storedTheme ?? systemTheme;

const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-theme", theme);
};

const ThemeContext = createContext<IThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme());
    const [storedTheme, setStoredTheme] = useState<Theme | null>(() => getStoredTheme());

    const theme = resolveTheme(storedTheme, systemTheme);
    const preference: ThemePreference = storedTheme ?? "system";

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(MEDIA_QUERY);

        const handleChange = (event: MediaQueryListEvent) => {
            setSystemTheme(event.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        const nextTheme = theme === "light" ? "dark" : "light";
        const nextStoredTheme = nextTheme === systemTheme ? null : nextTheme;

        setStoredTheme(nextStoredTheme);

        if (nextStoredTheme) {
            localStorage.setItem(STORAGE_KEY, nextStoredTheme);
            return;
        }

        localStorage.removeItem(STORAGE_KEY);
    }, [systemTheme, theme]);

    const value = useMemo(
        () => ({ theme, systemTheme, preference, toggleTheme }),
        [preference, systemTheme, theme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): IThemeContextProps => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};
