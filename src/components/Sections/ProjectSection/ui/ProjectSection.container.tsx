import ProjectSection from "./ProjectSection";
import { getProjects } from "@/utils/content/getProjects";
import { mapProjectsToCards } from "@/utils/content/mapToProjectCard";
import type { FC } from "react";

interface ProjectSectionContainerProps {
    locale: string;
}

export const ProjectSectionContainer: FC<ProjectSectionContainerProps> = (props) => {
    const { locale } = props;
    const projects = getProjects(locale);
    const cards = mapProjectsToCards(projects, locale);
    if (!cards.length) return null;

    return <ProjectSection projects={cards} />;
};
