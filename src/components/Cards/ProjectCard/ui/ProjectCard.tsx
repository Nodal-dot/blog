"use client";

import React from "react";
import style from "./ProjectCard.module.scss";
import Image from "next/image";
import Button from "@/components/Button";

interface IProjectCardProps {
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
    buttonText: string;
}

const ProjectCard: React.FC<IProjectCardProps> = ({
    title,
    subtitle,
    imageSrc,
    imageAlt,
    buttonText,
}) => {
    return (
        <article className={style["project-card"]}>
            <Image className={style["project-card__image"]} src={imageSrc} alt={imageAlt} />
            <div className={style["project-card__content"]}>
                <div className={style["project-card__headline"]}>
                    <h3 className={style["project-card__title"]}>{title}</h3>
                    <span className={style["project-card__subtitle"]}>{subtitle}</span>
                </div>
                <Button>{buttonText}</Button>
            </div>
        </article>
    );
};

export const MemoizedProjectCard = React.memo(ProjectCard);
