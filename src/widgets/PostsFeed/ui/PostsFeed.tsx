"use client";

import React, { useState, type FC } from "react";

import { PostCard, type ViewMode } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";
import styles from "./PostsFeed.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Search from "@/shared/ui/Search";
import { Select, type SelectOption } from "@/shared/ui/Select";
import Tags from "@/shared/ui/Tags";
import { usePostsFilter } from "@/features/posts/posts-filter";

interface PostsFeedProps {
    posts: Post[];
}

const VIEW_MODES: SelectOption[] = [
    { value: "compact", label: "Compact" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
];

const PostsFeed: FC<PostsFeedProps> = ({ posts }) => {
    const { query, setQuery, selectedTags, toggleTag, allTags, visiblePosts } = usePostsFilter({
        posts,
    });
    const [viewMode, setViewMode] = useState<ViewMode>("image");

    return (
        <section className={classNames(styles["posts-feed"], "section")}>
            <div className={styles["posts-feed__header"]}>
                <Search value={query} onChange={setQuery} />
                <Select
                    value={viewMode}
                    onChange={(value) => setViewMode(value as ViewMode)}
                    options={VIEW_MODES}
                    label="View Mode"
                    ariaLabel="Select view mode for posts"
                />
            </div>
            {
                // TODO: use swiper for tags
            }
            <div className={styles["posts-feed__tags-wrapper"]}>
                <Tags
                    as="div"
                    tagAs="button"
                    tags={allTags}
                    value={selectedTags}
                    onChange={(tags) => {
                        const changed =
                            tags.find((tag) => !selectedTags.includes(tag)) ??
                            selectedTags.find((tag) => !tags.includes(tag));

                        if (changed) toggleTag(changed);
                    }}
                    className={styles["posts-feed__tags-wrapper"]}
                />
            </div>

            <div className={styles["posts-feed__grid"]}>
                {visiblePosts.map((post) => (
                    <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        subtitle={post.subtitle}
                        image={post.image}
                        videoUrl={post.videoUrl}
                        tags={post.tags}
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </section>
    );
};
export default PostsFeed;
