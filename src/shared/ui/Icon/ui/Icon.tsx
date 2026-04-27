"use client";

import React, { type CSSProperties, type FC } from "react";
import styles from "./Icon.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { ICON_PATHS, type IconName } from "./paths";

export type { IconName } from "./paths";

export interface IconProps {
    name: IconName;
    size?: number;
    className?: string;
    ariaLabel?: string;
    style?: CSSProperties;
}

const IconComponent: FC<IconProps> = ({ name, size = 24, className, ariaLabel, style }) => {
    const accessibleProps = ariaLabel
        ? { role: "img" as const, "aria-label": ariaLabel }
        : { "aria-hidden": true };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={classNames(styles["icon"], className)}
            style={style}
            {...accessibleProps}
        >
            {ICON_PATHS[name]}
        </svg>
    );
};

export const Icon = React.memo(IconComponent);
