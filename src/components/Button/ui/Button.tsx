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
            className={classNames(
                style["button"],
                {
                    [style["button--disabled"]]: disabled!,
                },
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {leftIcon && (
                <span className={classNames(style["button__icon"], style["button__icon--left"])}>
                    {leftIcon}
                </span>
            )}
            <span className={style["button__text"]}>{children}</span>
            {rightIcon && (
                <span className={classNames(style["button__icon"], style["button__icon--right"])}>
                    {rightIcon}
                </span>
            )}
        </Component>
    );
};

export const MemoizedButton = React.memo(Button);
