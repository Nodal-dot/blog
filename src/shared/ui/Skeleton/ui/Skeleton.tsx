import React from "react";
import styles from "./Skeleton.module.scss";
import { classNames } from "@/shared/lib/classNames";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={classNames(styles["skeleton"], className)}>
            <span className={styles["skeleton__shimmer"]}></span>
        </div>
    );
};
