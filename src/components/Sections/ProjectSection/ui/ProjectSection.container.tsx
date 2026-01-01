import ProjectSection from "./ProjectSection";
import { getProjects } from "@/utils/content/getProjects";
import { mapProjectsToCards } from "@/utils/content/mapToProjectCard";

interface Props {
    locale: string;
}

export const ProjectSectionContainer = ({ locale }: Props) => {
    const projects = getProjects(locale);
    const cards = mapProjectsToCards(projects, locale);
    if (!cards.length) return null;

    return <ProjectSection projects={cards} />;
};
