"use client";

import React, { type FC } from "react";
import Image from "next/image";
import styles from "./IconLink.module.scss";
import { classNames } from "@/shared/lib/classNames";

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

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={classNames(styles["link"], styles[`size-${size}`], className)}
        >
            <span className={classNames(styles["link__icon"], styles["link__icon--light"])}>
                <Image src={iconLight} alt="" width={width} height={height} aria-hidden="true" />
            </span>
            <span className={classNames(styles["link__icon"], styles["link__icon--dark"])}>
                <Image src={iconDark} alt="" width={width} height={height} aria-hidden="true" />
            </span>
        </a>
    );
};

export const MemoizedIconLink = React.memo(IconLink);
