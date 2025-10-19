"use client";

import React, { type JSX, type ReactNode } from "react";
import style from "./Button.module.scss";
import { classNames } from "@/utils/classNames";

type ButtonProps = {
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    children,
    leftIcon,
    rightIcon,
    as: Component = "button",
    className,
    onClick,
    disabled,
}) => {
    return (
        <Component
            className={classNames(style.button, className, { [style.disabled]: disabled! })}
            onClick={onClick}
            disabled={disabled}
        >
            {leftIcon && (
                <span className={classNames(style.icon, style["icon-left"])}>{leftIcon}</span>
            )}
            <span>{children}</span>
            {rightIcon && (
                <span className={classNames(style.icon, style["icon-right"])}>{rightIcon}</span>
            )}
        </Component>
    );
};

export const MemoizedButton = React.memo(Button);
