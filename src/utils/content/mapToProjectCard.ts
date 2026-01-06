import type { Project } from "./types";
import type { ProjectCardProps } from "@/components/Cards/ProjectCard/ui/ProjectCard";

export function mapProjectsToCards(projects: Project[], locale: string): ProjectCardProps[] {
    return projects.map((project) => ({
        title: project.title,
        subtitle: project.subtitle,
        image: {
            src: project.image.src,
            alt: project.image.alt || "Project image",
        },
        buttonText: project.buttonText || "Подробнее",
        href: `/${locale}/projects/${project.slug}`,
    }));
}
