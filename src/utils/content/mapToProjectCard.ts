import type { Project } from "./types";
import type { ProjectCardProps } from "@/components/Cards/ProjectCard/ui/ProjectCard";

export function mapProjectsToCards(projects: Project[], locale: string): ProjectCardProps[] {
    return projects.map((project) => ({
        title: project.title,
        subtitle: project.subtitle,
        imageSrc: project.imageSrc,
        imageAlt: project.imageAlt || "Project image",
        buttonText: project.buttonText || "Подробнее",
        href: `/${locale}/projects/${project.slug}`,
    }));
}
