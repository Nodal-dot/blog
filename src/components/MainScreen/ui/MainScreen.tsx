"use client";

import React from "react";
import styles from "./MainScreen.module.scss";
import Eye from "@/components/Eye";

const MainScreen: React.FC = () => {
    return (
        <section className={styles["main-screen"]}>
            <div className={styles.before}>
                <div className={styles.headline}>
                    <h1>Привет. Я Владимир.</h1>
                    <h2>Фронтенд разработчик</h2>
                </div>

                <p>Разрабатываю интерфейсы</p>
            </div>
            <div className={styles.after}>
                <Eye />
            </div>
        </section>
    );
};

export const MemoizedMainScreen = React.memo(MainScreen);
