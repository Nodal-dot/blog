import type { PostCardProps } from "@/shared/ui/PostCard";
import type { Post } from "./types";

export function mapPostsToCards(posts: Post[]): PostCardProps[] {
    return posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt ?? "",
        image: { src: post.image.src, alt: post.image.alt },
        tags: post.tags,
        viewMode: "image",
    }));
}
