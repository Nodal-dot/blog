"use client";

import React, { type FC } from "react";
import { ArrowUp } from "lucide-react";
import Button from "@/components/Button";
import styles from "./ScrollToTopButton.module.scss";
import { classNames } from "@/utils/classNames";

type ScrollToTopButtonProps = {
    className?: string;
};

export const ScrollToTopButton: FC<ScrollToTopButtonProps> = ({ className }) => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Button
            onClick={scrollToTop}
            ariaLabel="Scroll to top"
            className={classNames(styles.scrollOverride, className)}
            leftIcon={<ArrowUp />}
        />
    );
};
