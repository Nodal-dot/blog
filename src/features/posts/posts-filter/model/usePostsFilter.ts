import { useState, useMemo, useCallback } from "react";
import type { Post } from "@/entities/post";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface UsePostsFilterProps {
    posts: Post[];
}

export const usePostsFilter = ({ posts }: UsePostsFilterProps) => {
    const [query, setQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const debouncedQuery = useDebounce(query, 300);

    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    const selectedTagsSet = useMemo(() => new Set(selectedTags), [selectedTags]);

    const allTags = useMemo(() => {
        return Array.from(new Set(posts.flatMap((p) => p.tags ?? [])));
    }, [posts]);

    const visiblePosts = useMemo(() => {
        return posts.filter((p) => {
            const text = `${p.title} ${p.subtitle}`.toLowerCase();

            const matchesQuery = normalizedQuery === "" || text.includes(normalizedQuery);

            const matchesTags =
                selectedTagsSet.size === 0 || (p.tags ?? []).some((t) => selectedTagsSet.has(t));

            return matchesQuery && matchesTags;
        });
    }, [posts, normalizedQuery, selectedTagsSet]);

    const toggleTag = useCallback((tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }, []);

    return {
        query,
        setQuery,
        selectedTags,
        toggleTag,
        allTags,
        visiblePosts,
    };
};
