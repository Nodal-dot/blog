"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import styles from "./LanguageSwitcher.module.scss";

const LanguageSwitcher: React.FC = () => {
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
        <div className={styles.container} ref={langRef}>
            <button
                onClick={() => setLangOpen(!langOpen)}
                aria-haspopup="true"
                aria-expanded={langOpen}
                aria-label="Change language"
                className={styles.button}
            >
                <Globe size={24} />
            </button>

            {langOpen && (
                <ul role="menu" className={`${styles.options} ${langOpen ? styles.open : ""}`}>
                    <li role="none">
                        <button
                            onClick={() => handleLangChange("en")}
                            role="menuitemradio"
                            aria-checked={locale === "en"}
                            className={locale === "en" ? styles.selected : ""}
                        >
                            EN
                        </button>
                    </li>
                    <li role="none">
                        <button
                            onClick={() => handleLangChange("ru")}
                            role="menuitemradio"
                            aria-checked={locale === "ru"}
                            className={locale === "ru" ? styles.selected : ""}
                        >
                            RU
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

const MemoizedLanguageSwitcher = React.memo(LanguageSwitcher);
export { MemoizedLanguageSwitcher as LanguageSwitcher };
