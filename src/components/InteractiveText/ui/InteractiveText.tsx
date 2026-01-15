import React, { type FC } from "react";
import styles from "./InteractiveText.module.scss";
import Button from "@/components/Button";

const FillWord = ({ children }: { children: React.ReactNode }) => (
    <span className={styles["interactiveText__fillWord"]}>{children}</span>
);

export const InteractiveText: FC = () => {
    return (
        <div className={styles["interactiveText__container"]}>
            <h1>Обо мне</h1>

            <p className={styles["interactiveText__paragraph"]}>
                Я <FillWord>фронтенд-разработчик</FillWord>, специализирующийся на создании{" "}
                <FillWord>производительных</FillWord> и <FillWord>доступных</FillWord> интерфейсов.
                В основном работаю с экосистемой <FillWord>React</FillWord> и{" "}
                <FillWord>Next.js</FillWord>.
            </p>

            <p className={styles["interactiveText__paragraph"]}>
                В коде ценю <FillWord>строгую типизацию</FillWord>, чистую архитектуру и{" "}
                <FillWord>Pixel Perfect</FillWord> верстку. Верю, что детали имеют значение.
            </p>

            <div className={styles["interactiveText__actions"]}>
                <Button as="a" href="/projects" ariaLabel="Перейти в проекты">
                    Посмотреть проекты
                </Button>
            </div>
        </div>
    );
};

export default InteractiveText;
