"use client";

import React, { type FC } from "react";
import { Input } from "@/shared/ui/Input";
import styles from "./Search.module.scss";
import { Icon } from "@/shared/ui/Icon";
import { useTranslations } from "next-intl";

interface SearchProps {
    value: string;
    onChange: (v: string) => void;
}

export const Search: FC<SearchProps> = React.memo(({ value, onChange }) => {
    const t = useTranslations("Search");

    return (
        <div className={styles["search"]}>
            <Input
                icon={<Icon name="search" />}
                type="text"
                name="search"
                label={t("label")}
                placeholder={t("placeholder")}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete="off"
            />
        </div>
    );
});

Search.displayName = "Search";
