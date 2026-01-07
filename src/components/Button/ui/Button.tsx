"use client";

import React, {
    forwardRef,
    type ButtonHTMLAttributes,
    type AnchorHTMLAttributes,
    type ReactNode,
    type ElementType,
} from "react";
import style from "./Button.module.scss";
import { classNames } from "@/utils/classNames";

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

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
    const {
        children,
        leftIcon,
        rightIcon,
        className,
        hovered = false,
        disabled = false,
        ariaLabel,
        ...rest
    } = props;

    const content = (
        <>
            {leftIcon && <span className={style.button__icon}>{leftIcon}</span>}
            {children && <span className={style.button__text}>{children}</span>}
            {rightIcon && <span className={style.button__icon}>{rightIcon}</span>}
        </>
    );

    if (props.as === "a") {
        const { href, onClick, ...anchorProps } = rest as ButtonAsLink;

        return (
            <a
                ref={ref as React.Ref<HTMLAnchorElement>}
                href={href}
                onClick={onClick}
                aria-label={ariaLabel}
                className={classNames(
                    style.button,
                    { [style["button--hovered"]]: hovered },
                    className
                )}
                {...anchorProps}
            >
                {content}
            </a>
        );
    }

    const { onClick, ...buttonProps } = rest as ButtonAsButton;

    return (
        <button
            ref={ref as React.Ref<HTMLButtonElement>}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={classNames(
                style.button,
                {
                    [style["button--disabled"]]: disabled,
                    [style["button--hovered"]]: hovered,
                },
                className
            )}
            {...buttonProps}
        >
            {content}
        </button>
    );
});

Button.displayName = "Button";

export const MemoizedButton = React.memo(Button);
