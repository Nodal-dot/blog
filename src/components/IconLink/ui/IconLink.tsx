"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/providers/theme/ThemeProvider";
import styles from "./IconLink.module.scss";

interface IconLinkProps {
    href: string;
    ariaLabel: string;
    iconLight: string;
    iconDark: string;
    width?: number;
    height?: number;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const IconLink: React.FC<IconLinkProps> = ({
    href,
    ariaLabel,
    iconLight,
    iconDark,
    width = 24,
    height = 24,
    size = "md",
    className = "",
}) => {
    const { theme } = useTheme();

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={`${styles.link} ${className} ${styles[`size_${size}`]}`}
        >
            <Image
                src={theme === "dark" ? iconDark : iconLight}
                alt={ariaLabel}
                width={width}
                height={height}
            />
        </a>
    );
};

const MemoizedIconLink = React.memo(IconLink);

export { MemoizedIconLink as IconLink };
