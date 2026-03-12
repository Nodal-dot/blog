"use client";

import React, { type FC, useCallback, useState } from "react";
import style from "./Tags.module.scss";
import { classNames } from "@/shared/lib/classNames";

export interface TagsProps {
    tags: string[];
    className?: string;

    as?: React.ElementType;
    tagAs?: React.ElementType;

    value?: string[];
    defaultValue?: string[];

    onChange?: (tags: string[]) => void;
}

export const Tags: FC<TagsProps> = ({
    tags,
    className = "",
    as: Wrapper = "ul",
    tagAs: Tag = "li",
    value,
    defaultValue = [],
    onChange,
}) => {
    const [internalTags, setInternalTags] = useState<string[]>(defaultValue);

    const isControlled = value !== undefined;
    const activeTags = isControlled ? value! : internalTags;
    const toggleTag = useCallback(
        (tag: string) => {
            const exists = activeTags.includes(tag);

            const newTags = exists ? activeTags.filter((t) => t !== tag) : [...activeTags, tag];

            if (!isControlled) {
                setInternalTags(newTags);
            }

            onChange?.(newTags);
        },
        [activeTags, isControlled, onChange]
    );
    if (tags.length === 0) {
        return null;
    }

    return (
        <Wrapper className={classNames(style["tags"], className)}>
            {tags.map((tag, index) => {
                const active = activeTags.includes(tag);

                return (
                    <Tag
                        key={index}
                        className={classNames(style["tags__item"], {
                            [style["tags__item--active"]]: active,
                        })}
                        data-active={active}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </Tag>
                );
            })}
        </Wrapper>
    );
};
