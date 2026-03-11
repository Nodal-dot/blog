import React, { type FC } from "react";
import Search from "@/features/Search";
import { Select, type SelectOption } from "@/shared/ui/Select";
import { type ViewMode } from "@/shared/ui/PostCard";
import styles from "./PostsHeader.module.scss";

interface PostsHeaderProps {
    query: string;
    onQueryChange: (query: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODES: SelectOption[] = [
    { value: "compact", label: "Compact" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
];

export const PostsHeader: FC<PostsHeaderProps> = ({
    query,
    onQueryChange,
    viewMode,
    onViewModeChange,
}) => {
    return (
        <div className={styles["posts-header"]}>
            <Search value={query} onChange={onQueryChange} />
            <Select
                value={viewMode}
                onChange={(value) => onViewModeChange(value as ViewMode)}
                options={VIEW_MODES}
                label="View Mode"
                ariaLabel="Select view mode for posts"
            />
        </div>
    );
};
