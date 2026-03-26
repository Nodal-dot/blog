import { getPosts } from "@/entities/post/api/getPosts";
import MainPosts from "./MainPosts";

import { getLocale } from "next-intl/server";

export const MainPostsContainer = async () => {
    const locale = await getLocale();

    const posts = await getPosts(locale);

    return <MainPosts posts={posts} />;
};
