import React from "react";
import styles from "./NavLink.module.scss";
import { classNames } from "@/utils/classNames";

interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

export const MemoizedNavLink = React.memo(NavLink);
