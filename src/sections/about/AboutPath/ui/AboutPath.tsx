"use client";

import React, { type FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/ui/Icon";
import Tags from "@/shared/ui/Tags";
import { classNames } from "@/shared/lib/classNames";
import { debounce } from "@/shared/lib/debounce";
import { initGsap } from "@/shared/lib/gsap/init";
import styles from "./AboutPath.module.scss";

initGsap();

const ICON_MAP = {
    nda_company: <Icon name="layers" size={64} />,
    university: <Icon name="graduation-cap" size={64} />,
    self_study: <Icon name="code-2" size={64} />,
} as const;

type PathItemKey = keyof typeof ICON_MAP;

export const AboutPath: FC = () => {
    const t = useTranslations("AboutPage.AboutPath");

    const containerRef = useRef<HTMLElement>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const ballRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const itemKeys: PathItemKey[] = ["nda_company", "university", "self_study"];

    useGSAP(
        () => {
            const items = itemsRef.current;
            const ball = ballRef.current;
            const progress = progressRef.current;

            if (!items.length || !ball || !progress) return;

            const ballOffset = ball.offsetHeight / 2;

            gsap.set(ball, { force3D: true });
            gsap.set(progress, { force3D: true });

            const ballSetY = gsap.quickSetter(ball, "y", "px");
            const progressSetY = gsap.quickSetter(progress, "y", "px");
            const progressSetScaleY = gsap.quickSetter(progress, "scaleY");

            let startY = 0;
            let endY = 0;
            let distance = 0;

            const getItemCenter = (item: HTMLElement) => item.offsetTop + item.offsetHeight / 2;

            const calculatePositions = () => {
                startY = getItemCenter(items[0]);
                endY = getItemCenter(items[items.length - 1]);
                distance = endY - startY;

                gsap.set(progress, { y: startY, height: distance, scaleY: 0 });
            };

            calculatePositions();

            const debouncedResizeHandler = debounce(() => {
                calculatePositions();
                ScrollTrigger.refresh();
            }, 300);
            window.addEventListener("resize", debouncedResizeHandler);

            let lastVisible: boolean | null = null;
            let lastActiveIndex = -1;

            const trigger = ScrollTrigger.create({
                trigger: items[0],
                start: "top center",
                endTrigger: items[items.length - 1],
                end: "center center",
                scrub: 0.5,

                onUpdate: (self) => {
                    const p = self.progress;

                    const isVisible = p > 0 && p < 1;

                    if (isVisible !== lastVisible) {
                        ball.classList.toggle(styles["is-visible"], isVisible);
                        progress.classList.toggle(styles["is-visible"], isVisible);
                        lastVisible = isVisible;
                    }

                    ballSetY(startY + distance * p - ballOffset);
                    progressSetY(startY);
                    progressSetScaleY(p);

                    const activeIndex = Math.round(p * (items.length - 1));

                    if (activeIndex !== lastActiveIndex) {
                        if (lastActiveIndex >= 0 && items[lastActiveIndex]) {
                            items[lastActiveIndex].classList.remove(styles["is-active"]);
                        }
                        if (items[activeIndex]) {
                            items[activeIndex].classList.add(styles["is-active"]);
                        }
                        lastActiveIndex = activeIndex;
                    }
                },
            });

            return () => {
                trigger.kill();
                window.removeEventListener("resize", debouncedResizeHandler);
                debouncedResizeHandler.cancel();
            };
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className={classNames(styles["about-path"], "section")}>
            <h2 className={styles["about-path__title"]}>{t("title")}</h2>

            <ol className={styles["about-path__list"]}>
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
