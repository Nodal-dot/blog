import type { FC } from "react";
import MainHero from "./MainHero";
import MainPosts from "./MainPosts";
import type { Post } from "@/entities/post";

interface MainPageProps {
    posts: Post[];
}

export const MainPage: FC<MainPageProps> = ({ posts }) => {
    return (
        <>
            <MainHero />
            <MainPosts posts={posts} />
        </>
    );
};
