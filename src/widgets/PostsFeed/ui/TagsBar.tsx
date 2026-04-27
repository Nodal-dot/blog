"use client";

import React, { memo, useCallback, type FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Tag from "@/shared/ui/Tag";
import styles from "./PostsFeed.module.scss";

interface TagsBarProps {
    allTags: string[];
    selectedTags: string[];
    onToggle: (tag: string) => void;
}

interface TagItemProps {
    tag: string;
    active: boolean;
    onToggle: (tag: string) => void;
}

const TagItem: FC<TagItemProps> = memo(({ tag, active, onToggle }) => {
    const handleClick = useCallback(() => {
        onToggle(tag);
    }, [onToggle, tag]);

    return (
        <Tag tagAs={"button"} data-active={active} onClick={handleClick}>
            {tag}
        </Tag>
    );
});

TagItem.displayName = "TagItem";

const TagsBarComponent: FC<TagsBarProps> = ({ allTags, selectedTags, onToggle }) => {
    const selectedSet = React.useMemo(() => new Set(selectedTags), [selectedTags]);

    return (
        <Swiper
            slidesPerView={"auto"}
            spaceBetween={8}
            className={styles["posts-feed__tags-wrapper"]}
        >
            {allTags.map((tag) => (
                <SwiperSlide className={styles["posts-feed__tag-slide"]} key={tag}>
                    <TagItem tag={tag} active={selectedSet.has(tag)} onToggle={onToggle} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export const TagsBar = memo(TagsBarComponent);
