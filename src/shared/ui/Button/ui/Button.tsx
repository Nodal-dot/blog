"use client";

import type { ButtonAsButton, ButtonAsLink, ButtonProps } from "../types";
import style from "./Button.module.scss";
import { classNames } from "@/shared/lib/classNames";
import React from "react";
import { Link as LocaleLink } from "@/shared/i18n/navigation";

type ButtonComponentProps = ButtonProps & {
    ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
};

const Button = (props: ButtonComponentProps) => {
    const {
        children,
        leftIcon,
        rightIcon,
        className,
        hovered = false,
        disabled = false,
        ariaLabel,
        ref,
        ...rest
    } = props;

    const content = (
        <>
            {leftIcon && <span className={style["button__icon"]}>{leftIcon}</span>}
            {children && <span className={style["button__text"]}>{children}</span>}
            {rightIcon && <span className={style["button__icon"]}>{rightIcon}</span>}
        </>
    );

    if (props.as === "a") {
        const anchorLinkProps = rest as ButtonAsLink;
        const { as: asProp, href, onClick, ...anchorProps } = anchorLinkProps;

        void asProp;

        return (
            <LocaleLink
                ref={ref as React.Ref<HTMLAnchorElement>}
                href={href}
                onClick={onClick}
                aria-label={ariaLabel}
                className={classNames(
                    style["button"],
                    { [style["button--hovered"]]: hovered },
                    className
                )}
                {...anchorProps}
            >
                {content}
            </LocaleLink>
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
                style["button"],
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
};

export const MemoizedButton = React.memo(Button);
