"use client";

import React, { useState, type FC } from "react";
import style from "./ProjectCard.module.scss";
import Image from "next/image";
import Button from "@/components/Button";

export interface ProjectCardProps {
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    buttonText: string;
    tags?: string[];
    href?: string;
}

const ProjectCard: FC<ProjectCardProps> = (props) => {
    const { title, subtitle, image, href, buttonText, tags = ["React", "Node js"] } = props;
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={style["project-card"]}
        >
            <a href={href} className={style["project-card__link"]}>
                {title}
            </a>
            <div className={style["project-card__image"]}>
                <Image width={400} height={300} src={image.src} alt={image.alt} />
            </div>

            <div className={style["project-card__content"]}>
                <div className={style["project-card__headline"]}>
                    <h3 className={style["project-card__title"]}>{title}</h3>
                    <span className={style["project-card__subtitle"]}>{subtitle}</span>
                </div>

                {tags.length > 0 && (
                    <ul className={style["project-card__tags"]}>
                        {tags.map((tag, index) => (
                            <li key={index} className={style["project-card__tag"]}>
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}

                <Button hovered={hovered}>{buttonText}</Button>
            </div>
        </article>
    );
};

export const MemoizedProjectCard = React.memo(ProjectCard);
