"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import style from "./Eye.module.scss";
import { classNames } from "@/utils/classNames";

const Eye: React.FC = () => {
    const pupilRef = useRef<HTMLDivElement>(null);
    const scleraRef = useRef<HTMLDivElement>(null);
    const blocksRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const pupil = pupilRef.current;
        const sclera = scleraRef.current;
        const blocks = [...blocksRefs.current];

        if (!pupil || !sclera) return;

        gsap.set(pupil, {
            position: "absolute",
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
        });

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
                x,
                y,
                duration: gsap.utils.random(0.8, 1.5),
                ease: "power2.out",
                onComplete: () => {
                    setTimeout(movePupil, gsap.utils.random(800, 2000));
                },
            });
        };

        movePupil();

        blocks.forEach((block, i) => {
            const moveY = gsap.utils.random(10, 25);
            const duration = gsap.utils.random(4, 7);
            gsap.to(block, {
                y: moveY,
                repeat: -1,
                yoyo: true,
                duration,
                ease: "sine.inOut",
                repeatDelay: gsap.utils.random(0.2, 0.8),
                delay: i * 0.3,
                force3D: true,
            });
        });
        return () => {
            gsap.killTweensOf(pupil);
            blocks.forEach((block) => gsap.killTweensOf(block));
        };
    }, []);

    return (
        <div className={style["eye-wrapper"]}>
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((side, index) => (
                <div
                    key={side}
                    ref={(el) => {
                        if (el) blocksRefs.current[index] = el;
                    }}
                    className={classNames([style["eye-block"], style[side]])}
                ></div>
            ))}

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
