import { getProjects, mapProjectsToCards } from "@/entities/project";
import ProjectSection from "./ProjectSection";

import type { FC } from "react";

interface ProjectSectionContainerProps {
    locale: string;
}

export const ProjectSectionContainer: FC<ProjectSectionContainerProps> = async (props) => {
    const { locale } = props;
    const projects = await getProjects(locale);
    const cards = mapProjectsToCards(projects, locale);
    if (!cards.length) return null;

    return <ProjectSection projects={cards} />;
};
