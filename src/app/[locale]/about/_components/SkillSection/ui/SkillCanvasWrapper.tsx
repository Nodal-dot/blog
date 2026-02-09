"use client";

import React, { useRef, useEffect, useLayoutEffect, type FC } from "react";
import styles from "./SkillSection.module.scss";
import { useSkillCanvas } from "../hooks/useSkillCanvas";

interface SkillCanvasWrapperProps {
    onReady?: () => void;
}

const SkillCanvasWrapper: FC<SkillCanvasWrapperProps> = (props) => {
    const { onReady } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const triggerElement = document.querySelector(".skill-scroll-trigger");
        if (triggerElement instanceof HTMLDivElement) {
            containerRef.current = triggerElement;
        }
    }, []);

    useSkillCanvas({ canvasRef, tooltipRef, containerRef });

    useEffect(() => {
        const timer = setTimeout(() => {
            onReady?.();
        }, 100);

        return () => clearTimeout(timer);
    }, [onReady]);

    return (
        <>
            <canvas ref={canvasRef} className={styles["skill-section__canvas"]} />
            <div ref={tooltipRef} className={styles["skill-section__tooltip"]} />
        </>
    );
};

export default SkillCanvasWrapper;
