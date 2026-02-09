"use client";

import { type FC, type ReactElement, cloneElement } from "react";
import type { ButtonAsButton, ButtonAsLink, ButtonProps } from "@/shared/ui/Button";

type ScrollButtonProps = {
    children: ReactElement<ButtonProps>;
    target?: string;
    offset?: number;
    behavior?: ScrollBehavior;
    fallback?: "top" | "bottom";
};

export const ScrollButton: FC<ScrollButtonProps> = (props) => {
    const { children, target, offset = 0, behavior = "smooth", fallback = "top" } = props;

    const scroll = () => {
        if (target) {
            const el = document.querySelector(target);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior });
                return;
            }
        }

        window.scrollTo({
            top: fallback === "bottom" ? document.body.scrollHeight : 0,
            behavior,
        });
    };
    if (children.props.as === "a") {
        const el = children as React.ReactElement<ButtonAsLink>;
        return cloneElement(el, {
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
                el.props.onClick?.(event);
                scroll();
            },
        });
    }

    const el = children as React.ReactElement<ButtonAsButton>;
    return cloneElement(el, {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            el.props.onClick?.(event);
            scroll();
        },
    });
};
