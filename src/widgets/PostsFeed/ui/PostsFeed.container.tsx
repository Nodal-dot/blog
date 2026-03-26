import { getPosts } from "@/entities/post/api/getPosts";
import PostsFeed from "./PostsFeed";
import { getLocale } from "next-intl/server";

export const PostsFeedContainer = async () => {
    const locale = await getLocale();

    const posts = await getPosts(locale);

    return <PostsFeed posts={posts} />;
};
