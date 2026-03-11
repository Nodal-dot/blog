import { getPosts, mapPostsToCards } from "@/entities/post";
import MainPosts from "./MainPosts";

import type { FC } from "react";
import type { Locale } from "@/i18n/types";

interface MainPostsContainerProps {
    locale: Locale;
}

export const MainPostsContainer: FC<MainPostsContainerProps> = async (props) => {
    const { locale } = props;
    const posts = await getPosts(locale as Locale);
    const cards = mapPostsToCards(posts);
    if (!cards.length) return null;

    return <MainPosts posts={cards} />;
};
