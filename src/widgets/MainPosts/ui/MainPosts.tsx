"use client";

import React, { useState, type FC } from "react";
import dynamic from "next/dynamic";

import styles from "./MainPosts.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Skeleton from "@/shared/ui/Skeleton";
import { useTranslations } from "next-intl";
import type { PostCardProps } from "@/shared/ui/PostCard";

const PostsSwiper = dynamic(() => import("./PostsSwiper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

interface MainPostsProps {
    posts: PostCardProps[];
}

export const MainPosts: FC<MainPostsProps> = (props) => {
    const { posts } = props;
    const [isSwiperReady, setIsSwiperReady] = useState(false);
    const t = useTranslations("HomePage.MainPosts");

    return (
        <section id="main-posts" className={classNames(styles["main-posts"], "section")}>
            <h2 className={styles["main-posts__title"]}>{t("title")}</h2>

            {!isSwiperReady && <Skeleton />}
            <div
                className={classNames(styles["main-posts__content"], {
                    [styles["main-posts__content--hidden"]]: !isSwiperReady,
                })}
            >
                <PostsSwiper
                    posts={posts}
                    onReady={() => setIsSwiperReady(true)}
                    paginationClassName={styles["main-posts__slider-pagination"]}
                />
                <div
                    className={styles["main-posts__slider-pagination"]}
                    aria-hidden={!isSwiperReady}
                />
            </div>
        </section>
    );
};

export default MainPosts;
