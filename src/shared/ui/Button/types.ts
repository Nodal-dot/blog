import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, ReactNode } from "react";

interface BaseButtonProps {
    children?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
    hovered?: boolean;
    as?: ElementType;
    ariaLabel?: string;
    href?: string;
    disabled?: boolean;
}

export type ButtonAsButton = {
    as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonAsLink = {
    as: "a";
    href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = BaseButtonProps & (ButtonAsButton | ButtonAsLink);
