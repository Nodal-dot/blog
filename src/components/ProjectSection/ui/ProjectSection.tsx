"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import styles from "./ProjectSection.module.scss";
import { classNames } from "@/utils/classNames";
import type { IProjectCardProps } from "@/components/Cards/ProjectCard/ui/ProjectCard";
import Skeleton from "@/components/Skeleton";

const ProjectSwiper = dynamic(() => import("./ProjectSwiper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

export const ProjectSection: React.FC = () => {
    const [isSwiperReady, setIsSwiperReady] = useState(false);

    const projects: IProjectCardProps[] = [
        {
            title: "Проект 1",
            subtitle: "Красивый пейзаж",
            imageSrc:
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            imageAlt: "Природа",
            buttonText: "Подробнее",
        },
        {
            title: "Проект 2",
            subtitle: "Современная архитектура",
            imageSrc:
                "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80",
            imageAlt: "Архитектура",
            buttonText: "Подробнее",
        },
        {
            title: "Проект 3",
            subtitle: "Городской пейзаж",
            imageSrc:
                "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
            imageAlt: "Город",
            buttonText: "Подробнее",
        },
    ];

    return (
        <section className={classNames(styles["project-section"], "section")}>
            <h2 className={styles["project-section__title"]}>Мои проекты</h2>

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
