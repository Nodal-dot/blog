"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import ProjectCard from "@/components/Cards/ProjectCard";
import styles from "./ProjectSection.module.scss";
import { classNames } from "@/utils/classNames";
import type { IProjectCardProps } from "@/components/Cards/ProjectCard/ui/ProjectCard";

export const ProjectSection: React.FC = () => {
    const paginationRef = useRef<HTMLDivElement | null>(null);

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

            <Swiper
                effect="coverflow"
                grabCursor
                centeredSlides
                initialSlide={1}
                slidesPerView={3}
                spaceBetween={24}
                modules={[EffectCoverflow, Pagination]}
                className={styles["project-section__slider"]}
                coverflowEffect={{
                    rotate: 20,
                    stretch: 0,
                    depth: 0,
                    slideShadows: false,
                }}
                pagination={{
                    clickable: true,
                    el: `.${styles["project-section__slider-pagination"]}`,
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 12,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                }}
            >
                {projects.map((project, index) => (
                    <SwiperSlide key={index} className={styles["swiper-slide"]}>
                        <ProjectCard {...project} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div ref={paginationRef} className={styles["project-section__slider-pagination"]}></div>
        </section>
    );
};
