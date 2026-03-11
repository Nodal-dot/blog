import React, { type FC, type ReactNode } from "react";
import styles from "./PostsGrid.module.scss";

interface PostsGridProps {
    children: ReactNode;
}

export const PostsGrid: FC<PostsGridProps> = ({ children }) => {
    return <div className={styles["posts-grid"]}>{children}</div>;
};
