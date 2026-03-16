import { useState, useMemo } from "react";
import type { Post } from "@/entities/post";

interface UsePostsFilterProps {
    posts: Post[];
}

export const usePostsFilter = ({ posts }: UsePostsFilterProps) => {
    const [query, setQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const allTags = useMemo(() => Array.from(new Set(posts.flatMap((p) => p.tags ?? []))), [posts]);

    const visiblePosts = useMemo(() => {
        return posts.filter((p) => {
            const matchesQuery = (p.title + " " + p.subtitle)
                .toLowerCase()
                .includes(query.toLowerCase());

            const matchesTags =
                selectedTags.length === 0 || (p.tags ?? []).some((t) => selectedTags.includes(t));

            return matchesQuery && matchesTags;
        });
    }, [posts, query, selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return {
        query,
        setQuery,
        selectedTags,
        toggleTag,
        allTags,
        visiblePosts,
    };
};
