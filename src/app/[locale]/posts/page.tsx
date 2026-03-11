import React, { type FC } from "react";
import type { Locale } from "@/i18n/types";
import { getPosts } from "@/entities/post/api/getPosts";
import PostsFeed from "@/widgets/PostsFeed";

interface PostsPageProps {
    params: Promise<{ locale: Locale }>;
}

const PostsPage: FC<PostsPageProps> = async (props) => {
    const { params } = props;
    const { locale } = await params;
    const posts = await getPosts(locale);

    return <PostsFeed posts={posts} />;
};

export default PostsPage;
