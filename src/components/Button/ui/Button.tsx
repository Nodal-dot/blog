"use client";

import React, { type FC, type JSX, type ReactNode } from "react";
import style from "./Button.module.scss";
import { classNames } from "@/utils/classNames";

type ButtonProps = {
    children?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
};

const Button: FC<ButtonProps> = ({
    children,
    leftIcon,
    rightIcon,
    as: Component = "button",
    className,
    onClick,
    disabled,
    ariaLabel,
}) => {
    return (
        <Component
            className={classNames(
                style.button,
                { [style["button--disabled"]]: disabled! },
                className
            )}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {leftIcon && <span className={style.button__icon}>{leftIcon}</span>}
            {children && <span className={style.button__text}>{children}</span>}
            {rightIcon && <span className={style.button__icon}>{rightIcon}</span>}
        </Component>
    );
};

export const MemoizedButton = React.memo(Button);
