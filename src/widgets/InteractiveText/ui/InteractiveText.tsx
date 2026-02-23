"use client";

import React, { type FC } from "react";
import styles from "./InteractiveText.module.scss";
import Button from "@/shared/ui/Button";
import { useTranslations } from "next-intl";

const FillWord = ({ children }: { children: React.ReactNode }) => (
    <span className={styles["interactiveText__fillWord"]}>{children}</span>
);

export const InteractiveText: FC = () => {
    const t = useTranslations("AboutPage.interactiveText");

    return (
        <div className={styles["interactiveText__container"]}>
            <h1>{t("title")}</h1>

            <p className={styles["interactiveText__paragraph"]}>
                {t.rich("paragraph1", {
                    dev: (chunks) => <FillWord>{chunks}</FillWord>,
                    perf: (chunks) => <FillWord>{chunks}</FillWord>,
                    access: (chunks) => <FillWord>{chunks}</FillWord>,
                })}
            </p>

            <p className={styles["interactiveText__paragraph"]}>
                {t.rich("paragraph2", {
                    types: (chunks) => <FillWord>{chunks}</FillWord>,
                    architecture: (chunks) => <FillWord>{chunks}</FillWord>,
                    pixel: (chunks) => <FillWord>{chunks}</FillWord>,
                })}
            </p>

            <div className={styles["interactiveText__actions"]}>
                <Button as="a" href="/projects" ariaLabel={t("buttonAria")}>
                    {t("button")}
                </Button>
            </div>
        </div>
    );
};

export default InteractiveText;
