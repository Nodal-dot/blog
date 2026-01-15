import React, { type FC } from "react";
import styles from "./InteractiveText.module.scss";
import Button from "@/components/Button";

const FillWord = ({ children }: { children: React.ReactNode }) => (
    <span className={styles.fillWord}>{children}</span>
);

export const InteractiveText: FC = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <span className={styles.badge} aria-hidden>
                    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="b1" x1="0" x2="1">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                        </defs>
                        <rect x="2" y="2" width="80" height="80" rx="16" fill="#f3f4f6" />
                        <path
                            d="M20 56 L34 30 L44 44 L60 22"
                            stroke="url(#b1)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                Обо мне
            </h2>

            <p className={styles.paragraph}>
                Я <FillWord>фронтенд-разработчик</FillWord>, специализирующийся на создании{" "}
                <FillWord>производительных</FillWord> и <FillWord>доступных</FillWord> интерфейсов.
                В основном работаю с экосистемой <FillWord>React</FillWord> и{" "}
                <FillWord>Next.js</FillWord>.
            </p>
            <p className={styles.paragraph}>
                В коде ценю <FillWord>строгую типизацию</FillWord>, чистую архитектуру и{" "}
                <FillWord>Pixel Perfect</FillWord> верстку. Верю, что детали имеют значение.
            </p>

            <div className={styles.actions}>
                <Button as="a" href="/projects" ariaLabel="Перейти в проекты">
                    Посмотреть проекты
                </Button>
                {/* TODO use link from i18n */}
                {/* <Link href="/contact" className={styles.contactLink}>
                    Связаться со мной
                </Link> */}
            </div>
        </div>
    );
};
