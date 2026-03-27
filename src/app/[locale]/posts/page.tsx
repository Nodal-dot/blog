import { getPosts } from "@/entities/post/api/getPosts";
import PostsFeed from "@/widgets/PostsFeed";
import type { Locale } from "next-intl";
import type { FC } from "react";

interface PostsPageProps {
    params: Promise<{ locale: Locale }>;
}

const PostsPage: FC<PostsPageProps> = async ({ params }) => {
    const { locale } = await params;

    const posts = await getPosts(locale);
    return <PostsFeed posts={posts} />;
};

export default PostsPage;
