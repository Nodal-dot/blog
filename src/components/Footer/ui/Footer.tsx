import React, { type FC } from "react";
import styles from "./Footer.module.scss";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <span className={styles.footer__meta}>© {new Date().getFullYear()}</span>
            <span className={styles.footer__meta}>Vladimir · Frontend Developer</span>
            <span className={styles.footer__meta}>@Nodal-dot</span>

            <div className={styles.footer__scroll}>
                <ScrollToTopButton className={styles["footer__scrollButton"]} />
            </div>
        </footer>
    );
};
