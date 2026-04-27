"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, type FC } from "react";

import { PostCard, type ViewMode } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";
import styles from "./PostsFeed.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Search from "@/shared/ui/Search";
import { Select, type SelectOption } from "@/shared/ui/Select";
import { usePostsFilter } from "@/features/posts/posts-filter";
import { Swiper, SwiperSlide } from "swiper/react";
import Tag from "@/shared/ui/Tag";
import { useTranslations } from "next-intl";
import "swiper/css";

interface PostsFeedProps {
    posts: Post[];
}

const PostsFeed: FC<PostsFeedProps> = ({ posts }) => {
    const t = useTranslations("PostsFeed");
    const { query, setQuery, selectedTags, toggleTag, allTags, visiblePosts } = usePostsFilter({
        posts,
    });
    const [viewMode, setViewMode] = useState<ViewMode>("image");
    const gridRef = useRef<HTMLDivElement | null>(null);

    const VIEW_MODES: SelectOption[] = useMemo(
        () => [
            { value: "compact", label: t("modes.compact") },
            { value: "image", label: t("modes.image") },
            { value: "video", label: t("modes.video") },
        ],
        [t]
    );

    const handleViewModeChange = useCallback((value: string) => {
        setViewMode(value as ViewMode);
    }, []);

    const tagClickHandler = useCallback(
        (tag: string) => {
            toggleTag(tag);
        },
        [toggleTag]
    );

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;
        const videos = grid.querySelectorAll<HTMLVideoElement>("video");
        videos.forEach((v) => {
            if (viewMode === "video") {
                v.play().catch(() => {});
            } else {
                v.pause();
            }
        });
    }, [viewMode, visiblePosts]);

    return (
        <section className={classNames(styles["posts-feed"], "section")}>
            <div className={styles["posts-feed__header"]}>
                <Search value={query} onChange={setQuery} />
                <Select
                    value={viewMode}
                    onChange={handleViewModeChange}
                    options={VIEW_MODES}
                    label={t("viewMode")}
                    ariaLabel={t("viewModeAria")}
                />
            </div>

            <Swiper
                slidesPerView={"auto"}
                spaceBetween={8}
                className={styles["posts-feed__tags-wrapper"]}
            >
                {allTags.map((tag, index) => {
                    const active = selectedTags.includes(tag);
                    return (
                        <SwiperSlide className={styles["posts-feed__tag-slide"]} key={index}>
                            <Tag
                                tagAs={"button"}
                                data-active={active}
                                onClick={() => tagClickHandler(tag)}
                            >
                                {tag}
                            </Tag>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div
                ref={gridRef}
                className={classNames(styles["posts-feed__grid"], styles[`mode-${viewMode}`])}
                data-view-mode={viewMode}
            >
                {visiblePosts.map((post) => (
                    <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        subtitle={post.subtitle}
                        image={post.image}
                        videoUrl={post.videoUrl}
                        tags={post.tags}
                    />
                ))}
            </div>
        </section>
    );
};

export default PostsFeed;
