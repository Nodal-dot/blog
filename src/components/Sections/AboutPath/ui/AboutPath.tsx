import React, { type FC } from "react";
import styles from "./AboutPath.module.scss";
import { classNames } from "@/utils/classNames";

type Entry = {
    date: string;
    title: string;
    place: string;
    description?: string;
};

const entries: Entry[] = [
    {
        date: "2023 — настоящее время",
        title: "Frontend Developer",
        place: "Фриланс / проекты",
        description:
            "Разработка клиентских приложений на React и Next.js, оптимизация производительности, внедрение доступности.",
    },
    {
        date: "2021 — 2023",
        title: "Frontend Engineer",
        place: "Компания XYZ",
        description:
            "Работа над продуктом, миграция на TypeScript, переработка компонентов и стилей.",
    },
    {
        date: "2018 — 2021",
        title: "Образование",
        place: "Университет ABC",
        description: "Бакалавриат по направлению прикладной информатики.",
    },
];

export const AboutPath: FC = () => {
    return (
        <section className={classNames(styles["about-path"], "section")}>
            <h2 className={styles["about-path__title"]}>Мой путь</h2>

            <ol className={styles["about-path__list"]}>
                {entries.map((e) => (
                    <li key={e.title} className={styles["about-path__item"]}>
                        <div className={styles["about-path__meta"]}>
                            <time dateTime={e.date}>{e.date}</time>
                            <div className={styles["about-path__place"]}>{e.place}</div>
                        </div>
                        <div className={styles["about-path__body"]}>
                            <div className={styles["about-path__title"]}>{e.title}</div>
                            {e.description && <p>{e.description}</p>}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default AboutPath;
