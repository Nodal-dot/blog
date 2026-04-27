"use client";

import React, { type FC } from "react";
import Image from "next/image";
import styles from "./IconLink.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { useTheme } from "@/app/providers/theme";

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

const IconLink: FC<IconLinkProps> = (props) => {
    const {
        href,
        ariaLabel,
        iconLight,
        iconDark,
        width = 24,
        height = 24,
        size = "md",
        className,
    } = props;
    const { theme } = useTheme();

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={classNames(styles["link"], styles[`size-${size}`], className)}
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

export const MemoizedIconLink = React.memo(IconLink);
