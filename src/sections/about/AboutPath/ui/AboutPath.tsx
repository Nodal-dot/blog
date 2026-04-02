"use client";

import React, { type FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Code2, Layers, GraduationCap } from "lucide-react";

import Tags from "@/shared/ui/Tags";
import { classNames } from "@/shared/lib/classNames";
import styles from "./AboutPath.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ICON_MAP = {
    freelance: <Code2 size={64} />,
    company_xyz: <Layers size={64} />,
    university: <GraduationCap size={64} />,
} as const;

type PathItemKey = keyof typeof ICON_MAP;

export const AboutPath: FC = () => {
    const t = useTranslations("AboutPage.AboutPath");

    const containerRef = useRef<HTMLElement>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const ballRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const itemKeys: PathItemKey[] = ["freelance", "company_xyz", "university"];

    useGSAP(
        () => {
            const items = itemsRef.current;
            const ball = ballRef.current;
            const progress = progressRef.current;

            if (!items.length || !ball || !progress) return;

            const ballOffset = ball.offsetHeight / 2;

            const ballSetY = gsap.quickSetter(ball, "y", "px");
            const progressSetH = gsap.quickSetter(progress, "height", "px");

            let startY = 0;
            let endY = 0;
            let distance = 0;

            const getItemCenter = (item: HTMLElement) => item.offsetTop + item.offsetHeight / 2;

            const calculatePositions = () => {
                startY = getItemCenter(items[0]);
                endY = getItemCenter(items[items.length - 1]);
                distance = endY - startY;

                gsap.set(progress, { y: startY });
            };

            calculatePositions();

            const resizeHandler = () => calculatePositions();
            window.addEventListener("resize", resizeHandler);

            const trigger = ScrollTrigger.create({
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
            });

            return () => {
                trigger.kill();
                window.removeEventListener("resize", resizeHandler);
            };
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className={classNames(styles["about-path"], "section")}>
            <h2 className={styles["about-path__title"]}>{t("title")}</h2>

            <ol className={styles["about-path__list"]} role="list">
                <div ref={progressRef} className={styles["about-path__progress"]} />

                <div ref={ballRef} className={styles["about-path__ball"]} />

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
                            className={styles["about-path__item"]}
                        >
                            <div className={styles["about-path__card"]}>
                                <div className={styles["about-path__after"]}>
                                    <h3>{t(`items.${key}.title`)}</h3>

                                    <span className={styles["about-path__date"]}>
                                        {t(`items.${key}.date`)}
                                    </span>

                                    <span className={styles["about-path__place"]}>
                                        {t(`items.${key}.place`)}
                                    </span>

                                    <Tags tags={tags} className={styles["about-path__tags"]} />
                                </div>

                                <div className={styles["about-path__before"]}>{ICON_MAP[key]}</div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

export default AboutPath;
