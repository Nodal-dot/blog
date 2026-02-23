"use client";
import { ArrowDown } from "lucide-react";

import React from "react";
import styles from "./MainHero.module.scss";
import Button from "@/shared/ui/Button";
import { classNames } from "@/shared/lib/classNames";
import { useTranslations } from "next-intl";
import ScrollButton from "@/shared/ui/ScrollButton";
import dynamic from "next/dynamic";
import Skeleton from "@/shared/ui/Skeleton";

const Eye = dynamic(() => import("@/widgets/Eye"), {
    ssr: false,
    loading: () => <Skeleton />,
});

export const MainHero: React.FC = () => {
    const t = useTranslations();

    return (
        <section className={classNames(styles["main-section"], "section")}>
            <div className={styles["main-section__content"]}>
                <div className={styles["main-section__headline"]}>
                    <h1>{t("HomePage.mainSection.greeting")}</h1>
                    <h2>{t("HomePage.mainSection.profession")}</h2>
                </div>
                <p>{t("HomePage.mainSection.description")}</p>
                <ScrollButton target="#project-section">
                    <Button rightIcon={<ArrowDown />} className={styles["main-section__button"]}>
                        {t("HomePage.mainSection.button")}
                    </Button>
                </ScrollButton>
            </div>
            <div className={styles["main-section__eye"]} aria-hidden="true">
                <Eye />
            </div>
        </section>
    );
};
