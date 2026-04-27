"use client";

import React, { useRef, useEffect, type FC } from "react";
import styles from "./AboutSkill.module.scss";
import { useSkillCanvas } from "../hooks/useSkillCanvas";

interface SkillCanvasWrapperProps {
    onReady?: () => void;
}

const SkillCanvasWrapper: FC<SkillCanvasWrapperProps> = ({ onReady }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useSkillCanvas({ canvasRef, tooltipRef });

    useEffect(() => {
        const timer = setTimeout(() => onReady?.(), 100);
        return () => clearTimeout(timer);
    }, [onReady]);

    return (
        <>
            <canvas ref={canvasRef} className={styles["about-skill__canvas"]} />
            <div ref={tooltipRef} className={styles["about-skill__tooltip"]} />
        </>
    );
};

export default SkillCanvasWrapper;
