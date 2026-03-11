import React, { type FC } from "react";
import styles from "./PostsFilter.module.scss";
import { classNames } from "@/shared/lib/classNames";

interface PostsFilterProps {
    allTags: string[];
    selected: string[];
    toggleTag: (tag: string) => void;
}

const PostsFilter: FC<PostsFilterProps> = ({ allTags, selected, toggleTag }) => {
    return (
        <div className={styles["posts-filter"]}>
            <div className={styles["posts-filter__scroll"]}>
                {allTags.map((tag) => {
                    const active = selected.includes(tag);
                    return (
                        <button
                            key={tag}
                            className={classNames(styles["posts-filter__tag"], {
                                [styles["posts-filter__tag--active"]]: active,
                            })}
                            onClick={() => toggleTag(tag)}
                            aria-pressed={active}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PostsFilter;
