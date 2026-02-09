"use client";

import React, { type FC, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PathSection.module.scss";
import Tags from "@/shared/ui/Tags";
import { classNames } from "@/shared/lib/classNames";
import { Code2, Layers, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type TimelineItem = {
    date: string;
    title: string;
    place: string;
    tags: string[];
    icon: React.ReactNode;
};

const entries: TimelineItem[] = [
    {
        date: "2023 — Present",
        title: "Frontend Developer",
        place: "Freelance",
        tags: ["React", "Next.js", "TypeScript", "A11y", "Performance"],
        icon: <Code2 size={64} />,
    },
    {
        date: "2021 — 2023",
        title: "Frontend Engineer",
        place: "Company XYZ",
        tags: ["TypeScript", "Design System", "SCSS"],
        icon: <Layers size={64} />,
    },
    {
        date: "2018 — 2021",
        title: "BSc in Computer Science",
        place: "University ABC",
        tags: ["Algorithms", "Data Structures", "OOP"],
        icon: <GraduationCap size={64} />,
    },
];

export const PathSection: FC = () => {
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const ballRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

        const getItemCenter = (item: HTMLElement) => {
            return item.offsetTop + item.offsetHeight / 2;
        };

        const calculatePositions = () => {
            startY = getItemCenter(items[0]);
            endY = getItemCenter(items[items.length - 1]);
            distance = endY - startY;

            gsap.set(progress, { y: startY });
        };

        calculatePositions();

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
        };
    }, []);
    return (
        // TODO rename class
        <section className={classNames(styles.timeline, "section")}>
            <h2 className={styles.timeline__title}>Мой путь</h2>

            <ol className={styles.timeline__list} role="list">
                <div ref={progressRef} className={styles.timeline__progress} />
                <div ref={ballRef} className={styles.timeline__ball} />

                {entries.map((e, i) => (
                    <li
                        key={e.title}
                        ref={(el) => {
                            if (el) itemsRef.current[i] = el;
                        }}
                        className={styles.timeline__item}
                    >
                        <div className={styles.timeline__card}>
                            <div className={styles.timeline__after}>
                                <h3>{e.title}</h3>
                                <span className={styles.timeline__date}>{e.date}</span>

                                <span className={styles.timeline__place}>{e.place}</span>
                                <Tags tags={e.tags} className={styles.timeline__tags} />
                            </div>
                            <div className={styles.timeline__before}>{e.icon}</div>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default PathSection;
