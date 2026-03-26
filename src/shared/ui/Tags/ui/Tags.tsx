import React, { type FC } from "react";
import style from "./Tags.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Tag from "@/shared/ui/Tag";
export interface TagsProps {
    tags: string[];
    className?: string;

    as?: React.ElementType;
    tagAs?: React.ElementType;

    value?: string[];
    defaultValue?: string[];

    onChange?: (tags: string[]) => void;
}

export const Tags: FC<TagsProps> = ({ tags, className = "", as: Wrapper = "ul", tagAs }) => {
    if (tags.length === 0) {
        return null;
    }

    return (
        <Wrapper className={classNames(style["tags"], className)}>
            {tags.map((tag, index) => {
                return (
                    <Tag tagAs={tagAs} key={index}>
                        {tag}
                    </Tag>
                );
            })}
        </Wrapper>
    );
};
