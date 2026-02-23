"use client";

import React, { type FC, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Code2, Layers, GraduationCap } from "lucide-react";

import Tags from "@/shared/ui/Tags";
import { classNames } from "@/shared/lib/classNames";
import styles from "./PathSection.module.scss";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
    freelance: <Code2 size={64} />,
    company_xyz: <Layers size={64} />,
    university: <GraduationCap size={64} />,
} as const;

type PathItemKey = keyof typeof ICON_MAP;

export const PathSection: FC = () => {
    const t = useTranslations("AboutPage.PathSection");
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const ballRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const itemKeys: PathItemKey[] = ["freelance", "company_xyz", "university"];

    useEffect(() => {
        const items = itemsRef.current;
        const ball = ballRef.current;
        const progress = progressRef.current;

        if (!items.length || !ball || !progress) return;

        const ballOffset = ball.offsetHeight / 2;
        const ballSetY = gsap.quickSetter(ball, "y", "px");
        const progressSetH = gsap.quickSetter(progress, "height", "px");

        let startY = 0,
            endY = 0,
            distance = 0;

        const getItemCenter = (item: HTMLElement) => item.offsetTop + item.offsetHeight / 2;

        const calculatePositions = () => {
            startY = getItemCenter(items[0]);
            endY = getItemCenter(items[items.length - 1]);
            distance = endY - startY;
            gsap.set(progress, { y: startY });
        };

        calculatePositions();
        window.addEventListener("resize", calculatePositions);

        const triggerInstance = gsap.to(ball, {
            scrollTrigger: {
                trigger: items[0],
                start: "top center",
                endTrigger: items[items.length - 1],
                end: "center center",
                scrub: 1,
                onUpdate: (self) => {
                    const p = self.progress;
                    const isVisible = p > 0 && p < 1;

                    ball.classList.toggle(styles["is-visible"], isVisible);
                    progress.classList.toggle(styles["is-visible"], isVisible);
                    ballSetY(startY + distance * p - ballOffset);
                    progressSetH(distance * p);

                    const activeIndex = Math.round(p * (items.length - 1));
                    items.forEach((item, i) => {
                        item.classList.toggle(styles["is-active"], i === activeIndex);
                    });
                },
            },
        });

        return () => {
            triggerInstance.kill();
            window.removeEventListener("resize", calculatePositions);
        };
    }, []);

    return (
        <section className={classNames(styles.timeline, "section")}>
            <h2 className={styles.timeline__title}>{t("title")}</h2>

            <ol className={styles.timeline__list} role="list">
                <div ref={progressRef} className={styles.timeline__progress} />
                <div ref={ballRef} className={styles.timeline__ball} />

                {itemKeys.map((key, i) => {
                    const tags = t(`items.${key}.tags`)
                        .split(",")
                        .map((s) => s.trim());

                    return (
                        <li
                            key={key}
                            ref={(el) => {
                                if (el) itemsRef.current[i] = el;
                            }}
                            className={styles.timeline__item}
                        >
                            <div className={styles.timeline__card}>
                                <div className={styles.timeline__after}>
                                    <h3>{t(`items.${key}.title`)}</h3>
                                    <span className={styles.timeline__date}>
                                        {t(`items.${key}.date`)}
                                    </span>
                                    <span className={styles.timeline__place}>
                                        {t(`items.${key}.place`)}
                                    </span>
                                    <Tags tags={tags} className={styles.timeline__tags} />
                                </div>
                                <div className={styles.timeline__before}>{ICON_MAP[key]}</div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

export default PathSection;
