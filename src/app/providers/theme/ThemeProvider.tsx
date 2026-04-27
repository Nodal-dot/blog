"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface IThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        const initialTheme = stored || "light";

        const id = requestAnimationFrame(() => {
            setTheme(initialTheme);
            document.documentElement.setAttribute("data-theme", initialTheme);
        });

        return () => cancelAnimationFrame(id);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", next);
            document.documentElement.setAttribute("data-theme", next);
            return next;
        });
    }, []);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): IThemeContextProps => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};
