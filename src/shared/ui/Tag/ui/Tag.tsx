"use client";

import React, { type FC } from "react";
import style from "./Tag.module.scss";
import { classNames } from "@/shared/lib/classNames";

export interface TagProps {
    tagAs?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TagComponent: FC<TagProps> = ({
    tagAs: Tag = "li",
    children,
    className,
    onClick,
    ...otherProps
}) => {
    return (
        <Tag className={classNames(style["tag"], className)} onClick={onClick} {...otherProps}>
            {children}
        </Tag>
    );
};

export const Tag = React.memo(TagComponent) as FC<TagProps>;
