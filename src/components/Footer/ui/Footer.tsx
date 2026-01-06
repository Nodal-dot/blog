import React, { type FC } from "react";
import styles from "./Footer.module.scss";
import ScrollButton from "@/components/ScrollButton";
import Link from "@/components/Link";
import Button from "@/components/Button";
import { ArrowUp } from "lucide-react";
import { GITHUB_URL } from "@/config/constants";

export const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <span className={styles.footer__meta}>© {new Date().getFullYear()}</span>
            <span className={styles.footer__meta}>Vladimir · Frontend Developer</span>
            <span className={styles.footer__meta}>
                <Link href={GITHUB_URL} label={"@Nodal-dot"} />
            </span>

            <div className={styles.footer__scroll}>
                <div className={styles.footer__scroll}>
                    <ScrollButton target="#top" offset={64}>
                        <Button
                            leftIcon={<ArrowUp />}
                            ariaLabel="Scroll to top"
                            className={styles["footer__scroll-button"]}
                        />
                    </ScrollButton>
                </div>
            </div>
        </footer>
    );
};
