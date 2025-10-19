"use client";
import { ArrowDown } from "lucide-react";

import React from "react";
import styles from "./MainScreen.module.scss";
import Eye from "@/components/Eye";
import Button from "@/components/Button";
import { classNames } from "@/utils/classNames";

const MainScreen: React.FC = () => {
    return (
        <section className={styles["main-screen"]}>
            <div className={styles["main-screen__content"]}>
                <div className={styles["main-screen__headline"]}>
                    <h1>Привет. Я Владимир.</h1>
                    <h2>Фронтенд разработчик</h2>
                </div>
                <p>
                    Превращаю идеи в аккуратный и логичный код. Люблю продуманные интерфейсы,
                    семантику и эстетику во всём, что делаю.
                </p>
                <Button
                    rightIcon={<ArrowDown />}
                    className={classNames(styles["main-screen__button"])}
                >
                    Посмотреть мои работы
                </Button>
            </div>
            <div className={styles["main-screen__eye"]} aria-hidden="true">
                <Eye />
            </div>
        </section>
    );
};

export const MemoizedMainScreen = React.memo(MainScreen);
