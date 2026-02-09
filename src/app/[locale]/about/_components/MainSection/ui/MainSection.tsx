"use client";

import React, { type FC } from "react";
import styles from "./MainSection.module.scss";
import { classNames } from "@/shared/lib/classNames";
import dynamic from "next/dynamic";
import Skeleton from "@/shared/ui/Skeleton";
import InteractiveText from "./InteractiveText";

const Workspace = dynamic(() => import("./Workspace"), {
    ssr: false,
    loading: () => <Skeleton />,
});
export const MainSection: FC = () => {
    return (
        <section className={classNames(styles["about-main"], "section")}>
            <Workspace />
            <InteractiveText />
        </section>
    );
};

export default MainSection;
