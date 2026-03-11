import React, { type FC } from "react";
import { Input } from "@/shared/ui/Input";
import styles from "./Search.module.scss";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
    value: string;
    onChange: (v: string) => void;
}

export const Search: FC<SearchProps> = ({ value, onChange }) => {
    return (
        <div className={styles.search}>
            <Input
                icon={<SearchIcon />}
                type="text"
                name="search"
                placeholder="Search posts..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete="off"
            />
        </div>
    );
};
