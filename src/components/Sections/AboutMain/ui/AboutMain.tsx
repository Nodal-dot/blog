"use client";

import React, { type FC } from "react";
import styles from "./AboutMain.module.scss";
import { classNames } from "@/utils/classNames";
import InteractiveText from "@/components/InteractiveText";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Skeleton";

const Workspace = dynamic(() => import("@/components/Workspace"), {
    ssr: false,
    loading: () => <Skeleton />,
});
export const AboutMain: FC = () => {
    return (
        <section className={classNames(styles["about-main"], "section")}>
            <Workspace />
            <InteractiveText />
        </section>
    );
};

export default AboutMain;
