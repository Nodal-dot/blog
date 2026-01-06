export interface Project {
    slug: string;
    title: string;
    subtitle: string;
    image: {
        src: string;
        alt: string;
    };
    buttonText?: string;
    tags?: string[];
}
