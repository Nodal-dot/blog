"use client";

import React, { useRef, useEffect } from "react";
import styles from "./SkillSection.module.scss";
import { useSkillCanvas } from "../hooks/useSkillCanvas";

interface SkillCanvasWrapperProps {
    onReady?: () => void;
}

const SkillCanvasWrapper: React.FC<SkillCanvasWrapperProps> = ({ onReady }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useSkillCanvas(canvasRef, tooltipRef);

    useEffect(() => {
        if (canvasRef.current && tooltipRef.current) {
            onReady?.();
        }
    }, [onReady]);

    return (
        <>
            <canvas ref={canvasRef} className={styles["skill-section__canvas"]} />
            <div ref={tooltipRef} className={styles["skill-section__tooltip"]} />
        </>
    );
};

export default SkillCanvasWrapper;
