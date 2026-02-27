import { getProjects, mapProjectsToCards } from "@/entities/project";
import MainProjects from "./MainProjects";

import type { FC } from "react";

interface MainProjectsContainerProps {
    locale: string;
}

export const MainProjectsContainer: FC<MainProjectsContainerProps> = async (props) => {
    const { locale } = props;
    const projects = await getProjects(locale);
    const cards = mapProjectsToCards(projects);
    if (!cards.length) return null;

    return <MainProjects projects={cards} />;
};
