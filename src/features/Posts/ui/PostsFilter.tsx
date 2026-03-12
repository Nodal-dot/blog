import React, { type FC } from "react";
import styles from "./PostsFilter.module.scss";
import Tags from "@/shared/ui/Tags";

interface PostsFilterProps {
    allTags: string[];
    selected: string[];
    toggleTag: (tag: string) => void;
}

const PostsFilter: FC<PostsFilterProps> = ({ allTags, selected, toggleTag }) => {
    return (
        <div className={styles["posts-filter"]}>
            <div className={styles["posts-filter__scroll"]}>
                <Tags
                    as="div"
                    tagAs="button"
                    tags={allTags}
                    value={selected}
                    onChange={(tags) => {
                        const changed =
                            tags.find((t) => !selected.includes(t)) ??
                            selected.find((t) => !tags.includes(t));

                        if (changed) toggleTag(changed);
                    }}
                    className={styles["posts-filter__tags"]}
                />
            </div>
        </div>
    );
};

export default PostsFilter;
