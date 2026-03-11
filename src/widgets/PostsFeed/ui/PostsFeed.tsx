"use client";

import React, { useState, type FC } from "react";

import {
    PostsHeader,
    PostsGrid,
    PostsFilter,
    usePostsFilter,
    usePostsPreview,
} from "@/features/Posts";
import { PostCard, type ViewMode } from "@/shared/ui/PostCard";
import { PostPopup } from "@/shared/ui/PostPopup";
import type { Post } from "@/entities/post";
import styles from "./PostsFeed.module.scss";
import { classNames } from "@/shared/lib/classNames";

interface PostsClientProps {
    posts: Post[];
}

export const PostsFeed: FC<PostsClientProps> = ({ posts }) => {
    const { query, setQuery, selectedTags, toggleTag, allTags, visiblePosts } = usePostsFilter({
        posts,
    });
    const { active, openPreview, closePreview } = usePostsPreview();
    const [viewMode, setViewMode] = useState<ViewMode>("image");

    const handleHoverPlay = (id?: string, videoUrl?: string) => {
        if (!id) return closePreview();
        openPreview(id, videoUrl);
    };

    return (
        <section className={classNames(styles["posts-feed"], "section")}>
            <PostsHeader
                query={query}
                onQueryChange={setQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            <PostsFilter allTags={allTags} selected={selectedTags} toggleTag={toggleTag} />

            <PostsGrid>
                {visiblePosts.map((post) => (
                    <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        excerpt={post.excerpt ?? ""}
                        image={post.image}
                        videoUrl={post.videoUrl}
                        tags={post.tags}
                        viewMode={viewMode}
                        onHoverPlay={handleHoverPlay}
                    />
                ))}
            </PostsGrid>

            <PostPopup
                activeId={active.id}
                videoUrl={active.videoUrl}
                visible={active.visible}
                onClose={closePreview}
            />
        </section>
    );
};
