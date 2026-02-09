"use client";

import React, { useState, type FC } from "react";
import dynamic from "next/dynamic";
import styles from "./SkillSection.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Skeleton from "@/shared/ui/Skeleton";
import { useTranslations } from "next-intl";

const SkillCanvasWrapper = dynamic(() => import("./SkillCanvasWrapper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

export const SkillSection: FC = () => {
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const t = useTranslations("AboutPage.SkillSection");

    return (
        <section className={classNames(styles["skill-section"], styles["section"])}>
            <h2>{t("title")}</h2>

            {!isCanvasReady && <Skeleton />}

            <div
                className={classNames(
                    styles["skill-section__canvas-wrapper"],
                    "skill-scroll-trigger",
                    {
                        [styles["skill-section__canvas-wrapper--hidden"]]: !isCanvasReady,
                    }
                )}
            >
                <SkillCanvasWrapper onReady={() => setIsCanvasReady(true)} />
            </div>
        </section>
    );
};

export default SkillSection;
