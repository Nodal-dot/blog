"use client";

import React, { type FC } from "react";
import styles from "./AboutHero.module.scss";
import { classNames } from "@/shared/lib/classNames";
import dynamic from "next/dynamic";
import Skeleton from "@/shared/ui/Skeleton";
import InteractiveText from "@/widgets/InteractiveText";

const Workspace = dynamic(() => import("@/widgets/Workspace"), {
    ssr: false,
    loading: () => <Skeleton />,
});
export const AboutHero: FC = () => {
    return (
        <section className={classNames(styles["about-hero"], "section")}>
            <Workspace />
            <InteractiveText />
        </section>
    );
};

export default AboutHero;
