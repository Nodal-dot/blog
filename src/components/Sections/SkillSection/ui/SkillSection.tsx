"use client";

import React, { useState, type FC } from "react";
import dynamic from "next/dynamic";
import styles from "./SkillSection.module.scss";
import { classNames } from "@/utils/classNames";
import Skeleton from "@/components/Skeleton";

const SkillCanvasWrapper = dynamic(() => import("./SkillCanvasWrapper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

export const SkillSection: FC = () => {
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    return (
        <section className={classNames(styles["skill-section"], styles["section"])}>
            <h2>Мои скиллы</h2>

            {!isCanvasReady && <Skeleton />}

            <div
                className={classNames(
                    styles["skill-section__canvas-wrapper"],
                    styles["skill-scroll-trigger"],
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
