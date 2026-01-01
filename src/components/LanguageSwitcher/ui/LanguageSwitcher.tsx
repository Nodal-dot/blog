"use client";

import React, { useState, useRef, useEffect, type FC } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import styles from "./LanguageSwitcher.module.scss";
import { classNames } from "@/utils/classNames";

export const LanguageSwitcher: FC = () => {
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const locale = useLocale();
    const router = useRouter();
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLangChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setLangOpen(false);
    };

    return (
        <div className={styles["language-switcher"]} ref={langRef}>
            <button
                onClick={() => setLangOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={langOpen}
                aria-label="Change language"
                className={styles["language-switcher__trigger"]}
            >
                <Languages size={24} />
            </button>

            <ul
                role="menu"
                className={classNames(styles["language-switcher__options"], {
                    [styles["language-switcher__options-opened"]]: langOpen,
                })}
            >
                {["en", "ru"].map((lang) => (
                    <li role="none" key={lang}>
                        <button
                            onClick={() => handleLangChange(lang)}
                            role="menuitemradio"
                            aria-checked={locale === lang}
                            className={classNames(locale === lang && styles.selected)}
                            disabled={locale === lang}
                        >
                            {lang.toUpperCase()}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
