"use client";
import React from "react";
import styles from "./Link.module.scss";
import { classNames } from "@/utils/classNames";

interface LinkProps {
    href: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const Link: React.FC<LinkProps> = (props) => {
    const { href, label, isActive, onClick } = props;
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!onClick) return;

        e.preventDefault();
        onClick();
    };
    return (
        <a
            href={href}
            onClick={handleClick}
            aria-current={isActive ? "page" : undefined}
            className={classNames(styles.link, isActive && styles.active)}
        >
            {label}
        </a>
    );
};

export const MemoizedLink = React.memo(Link);
