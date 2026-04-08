import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

interface BaseButtonProps {
    children?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
    hovered?: boolean;
    ariaLabel?: string;
    href?: string;
    disabled?: boolean;
}

export type ButtonAsButton = BaseButtonProps & {
    as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonAsLink = BaseButtonProps & {
    as: "a";
    href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;
