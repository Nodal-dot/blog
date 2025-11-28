"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import ProjectCard from "@/components/Cards/ProjectCard";
import styles from "./ProjectSection.module.scss";
import type { IProjectCardProps } from "@/components/Cards/ProjectCard/ui/ProjectCard";

interface Props {
    projects: IProjectCardProps[];
    onReady?: () => void;
    paginationClassName: string;
}

const ProjectSwiper: React.FC<Props> = ({ projects, onReady, paginationClassName }) => {
    return (
        <Swiper
            onInit={(swiper) => {
                onReady?.();
                requestAnimationFrame(() => swiper.update());
            }}
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
                el: `.${paginationClassName}`,
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
    );
};

export default ProjectSwiper;
