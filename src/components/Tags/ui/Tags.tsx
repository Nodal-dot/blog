"use client";

import React, { type FC } from "react";
import style from "./Tags.module.scss";

export interface TagsProps {
    tags: string[];
    className?: string;
}

const Tags: FC<TagsProps> = ({ tags, className = "" }) => {
    if (tags.length === 0) {
        return null;
    }

    return (
        <ul className={`${style["tags"]} ${className}`.trim()}>
            {tags.map((tag, index) => (
                <li key={index} className={style["tags__tag"]}>
                    {tag}
                </li>
            ))}
        </ul>
    );
};

export default Tags;
