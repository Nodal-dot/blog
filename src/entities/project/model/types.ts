export interface ProjectCardProps {
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    buttonText: string;
    tags?: string[];
    href: string;
    className?: string;
}
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
