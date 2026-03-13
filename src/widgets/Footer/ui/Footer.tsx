import React, { type FC } from "react";
import styles from "./Footer.module.scss";
import ScrollButton from "@/shared/ui/ScrollButton";
import Link from "@/shared/ui/Link";
import Button from "@/shared/ui/Button";
import { ArrowUp } from "lucide-react";
import { GITHUB_URL } from "@/shared/config/urls";

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
