"use client";
import { ArrowDown } from "lucide-react";

import React from "react";
import styles from "./MainSection.module.scss";
import Eye from "@/components/Eye";
import Button from "@/components/Button";
import { classNames } from "@/utils/classNames";
import { useTranslations } from "next-intl";
import ScrollButton from "@/components/ScrollButton";

export const MainSection: React.FC = () => {
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
