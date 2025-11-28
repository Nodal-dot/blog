import React from "react";
import styles from "./Skeleton.module.scss";
import { classNames } from "@/utils/classNames";

interface ISkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<ISkeletonProps> = ({ className }) => {
    return (
        <div className={classNames(styles.skeleton, className)}>
            <span className={styles.shimmer}></span>
        </div>
    );
};
