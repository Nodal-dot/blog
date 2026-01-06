"use client";

import React, { useState, type FC } from "react";
import dynamic from "next/dynamic";

import styles from "./ProjectSection.module.scss";
import { classNames } from "@/utils/classNames";
import Skeleton from "@/components/Skeleton";
import type { ProjectCardProps } from "@/components/Cards/ProjectCard/ui/ProjectCard";
import { useTranslations } from "next-intl";

const ProjectSwiper = dynamic(() => import("./ProjectSwiper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

interface ProjectSectionProps {
    projects: ProjectCardProps[];
}

export const ProjectSection: FC<ProjectSectionProps> = (props) => {
    const { projects } = props;
    const [isSwiperReady, setIsSwiperReady] = useState(false);
    const t = useTranslations();

    return (
        <section id="project-section" className={classNames(styles["project-section"], "section")}>
            <h2 className={styles["project-section__title"]}>
                {t("HomePage.ProjectsSection.title")}
            </h2>

            {!isSwiperReady && <Skeleton />}
            <div
                className={classNames(styles["project-section__content"], {
                    [styles["project-section__content--hidden"]]: !isSwiperReady,
                })}
            >
                <ProjectSwiper
                    projects={projects}
                    onReady={() => setIsSwiperReady(true)}
                    paginationClassName={styles["project-section__slider-pagination"]}
                />
                <div
                    className={styles["project-section__slider-pagination"]}
                    aria-hidden={!isSwiperReady}
                />
            </div>
        </section>
    );
};

export default ProjectSection;
