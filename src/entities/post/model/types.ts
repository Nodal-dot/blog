export interface Post {
    id: string;
    title: string;
    excerpt: string;
    image: { src: string; alt: string };
    videoUrl?: string;
    tags?: string[];
    date?: string;
}
