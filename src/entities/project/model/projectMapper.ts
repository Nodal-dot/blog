import type { Project, ProjectCardProps } from "./types";

export function mapProjectsToCards(projects: Project[], locale: string): ProjectCardProps[] {
    return projects.map((project) => ({
        title: project.title,
        subtitle: project.subtitle,
        image: {
            src: project.image.src,
            alt: project.image.alt,
        },
        buttonText: project.buttonText || "Подробнее",
        tags: project.tags,
        href: `/${locale}/projects/${project.slug}`,
    }));
}
