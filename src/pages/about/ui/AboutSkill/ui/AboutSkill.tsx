"use client";

import React, { useState, type FC } from "react";
import dynamic from "next/dynamic";
import styles from "./AboutSkill.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Skeleton from "@/shared/ui/Skeleton";
import { useTranslations } from "next-intl";

const SkillCanvasWrapper = dynamic(() => import("./SkillCanvasWrapper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

export const AboutSkill: FC = () => {
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const t = useTranslations("AboutPage.AboutSkill");

    return (
        <section className={classNames(styles["about-skill"], styles["section"])}>
            <h2>{t("title")}</h2>

            {!isCanvasReady && <Skeleton />}

            <div
                className={classNames(
                    styles["about-skill__canvas-wrapper"],
                    "skill-scroll-trigger",
                    {
                        [styles["about-skill__canvas-wrapper--hidden"]]: !isCanvasReady,
                    }
                )}
            >
                <SkillCanvasWrapper onReady={() => setIsCanvasReady(true)} />
            </div>
        </section>
    );
};

export default AboutSkill;
