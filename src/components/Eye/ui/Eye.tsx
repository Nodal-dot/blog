"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import style from "./Eye.module.scss";
import { classNames } from "@/utils/classNames";

const Eye: React.FC = () => {
    const pupilRef = useRef<HTMLDivElement>(null);
    const scleraRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const pupil = pupilRef.current;
        const sclera = scleraRef.current;

        if (!pupil || !sclera) return;

        const scleraRect = sclera.getBoundingClientRect();
        const pupilRect = pupil.getBoundingClientRect();

        const scleraRadiusX = scleraRect.width / 2;
        const scleraRadiusY = scleraRect.height / 2;
        const pupilRadius = pupilRect.width / 2;

        const maxOffsetX = scleraRadiusX - pupilRadius - 5;
        const maxOffsetY = scleraRadiusY - pupilRadius - 5;

        const movePupil = () => {
            const angle = Math.random() * Math.PI * 2;
            const radiusX = Math.random() * maxOffsetX;
            const radiusY = Math.random() * maxOffsetY;

            const x = radiusX * Math.cos(angle);
            const y = radiusY * Math.sin(angle);

            gsap.to(pupil, {
                x: x,
                y: y,
                duration: gsap.utils.random(0.8, 1.5),
                ease: "power2.out",
                onComplete: () => {
                    setTimeout(movePupil, gsap.utils.random(800, 2000));
                },
            });
        };

        movePupil();

        return () => {
            gsap.killTweensOf(pupil);
        };
    }, []);

    return (
        <div className={style["eye-wrapper"]}>
            <div className={style.eye}>
                <div className={classNames([style.eyelash, style["type-1"]])}></div>
                <div className={classNames([style.eyelash, style["type-2"]])}></div>
                <div className={classNames([style.eyelash, style["type-3"]])}></div>
                <div className={style.sclera} ref={scleraRef}>
                    <div className={style.pupil} ref={pupilRef}></div>
                </div>
            </div>
        </div>
    );
};

export const MemoizedEye = React.memo(Eye);
