"use client";

import React, { useState, type FC } from "react";
import style from "./ProjectCard.module.scss";
import Image from "next/image";
import Button from "@/shared/ui/Button";
import Tags from "@/shared/ui/Tags";
import type { ProjectCardProps } from "../../model/types";
import { Link } from "@/i18n/navigation";

const ProjectCard: FC<ProjectCardProps> = (props) => {
    // TODO fix tags hardcode
    const { title, subtitle, image, href, buttonText, tags = ["React", "Node js"] } = props;
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={style["project-card"]}
        >
            <Link href={href} className={style["project-card__link"]}>
                {title}
            </Link>
            <div className={style["project-card__image"]}>
                <Image width={400} height={300} src={image.src} alt={image.alt} />
            </div>

            <div className={style["project-card__content"]}>
                <div className={style["project-card__headline"]}>
                    <h3 className={style["project-card__title"]}>{title}</h3>
                    <span className={style["project-card__subtitle"]}>{subtitle}</span>
                </div>

                <Tags tags={tags} className={style["project-card__tags"]} />

                <Button hovered={hovered}>{buttonText}</Button>
            </div>
        </article>
    );
};

export const MemoizedProjectCard = React.memo(ProjectCard);
