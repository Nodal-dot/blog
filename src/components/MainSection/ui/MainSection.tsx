"use client";
import { ArrowDown } from "lucide-react";

import React from "react";
import styles from "./MainSection.module.scss";
import Eye from "@/components/Eye";
import Button from "@/components/Button";
import { classNames } from "@/utils/classNames";

export const MainSection: React.FC = () => {
    return (
        <section className={classNames(styles["main-section"], "section")}>
            <div className={styles["main-section__content"]}>
                <div className={styles["main-section__headline"]}>
                    <h1>Привет. Я Владимир.</h1>
                    <h2>Фронтенд разработчик</h2>
                </div>
                <p>
                    Превращаю идеи в аккуратный и логичный код. Люблю продуманные интерфейсы,
                    семантику и эстетику во всём, что делаю.
                </p>
                <Button rightIcon={<ArrowDown />} className={styles["main-section__button"]}>
                    Посмотреть мои работы
                </Button>
            </div>
            <div className={styles["main-section__eye"]} aria-hidden="true">
                <Eye />
            </div>
        </section>
    );
};
