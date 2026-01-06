"use client";

import React, { type FC, type JSX, type ReactNode } from "react";
import style from "./Button.module.scss";
import { classNames } from "@/utils/classNames";

export type ButtonProps = {
    children?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
    href?: string;
    hovered?: boolean;
};

const Button: FC<ButtonProps> = ({
    children,
    leftIcon,
    rightIcon,
    as: Component = "button",
    className,
    onClick,
    disabled = false,
    ariaLabel,
    href,
    hovered = false,
}) => {
    const isLink = Component === "a";

    return (
        <Component
            className={classNames(
                style.button,
                {
                    [style["button--disabled"]]: disabled && !isLink,
                    [style["button--hovered"]]: hovered,
                },
                className
            )}
            onClick={onClick}
            aria-label={ariaLabel}
            href={isLink ? href : undefined}
            tabIndex={disabled && isLink ? -1 : undefined}
        >
            {leftIcon && <span className={style.button__icon}>{leftIcon}</span>}
            {children && <span className={style.button__text}>{children}</span>}
            {rightIcon && <span className={style.button__icon}>{rightIcon}</span>}
        </Component>
    );
};

export const MemoizedButton = React.memo(Button);
