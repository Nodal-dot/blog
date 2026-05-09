"use client";

import React, { useRef, type FC } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initGsap } from "@/shared/lib/gsap/init";

import style from "./Eye.module.scss";

initGsap();

const Eye: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pupilRef = useRef<HTMLDivElement>(null);
    const scleraRef = useRef<HTMLDivElement>(null);
    const blocksRefs = useRef<HTMLDivElement[]>([]);

    useGSAP(
        () => {
            const container = containerRef.current;
            const pupil = pupilRef.current;
            const sclera = scleraRef.current;
            const blocks = blocksRefs.current;

            if (!container || !pupil || !sclera) return;

            gsap.set(pupil, {
                position: "absolute",
                top: "50%",
                left: "50%",
                xPercent: -50,
                yPercent: -50,
            });

            const scleraRect = sclera.getBoundingClientRect();
            const pupilRect = pupil.getBoundingClientRect();

            const a = scleraRect.width / 2 - pupilRect.width / 2 - 10;
            const b = scleraRect.height / 2 - pupilRect.height / 2 - 10;

            const pupilTl = gsap.timeline({
                repeat: -1,
                repeatDelay: 0.8,
                paused: true,
                repeatRefresh: true,
            });

            pupilTl.to(pupil, {
                x: () => {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.sqrt(Math.random());
                    return Math.cos(angle) * r * a;
                },
                y: () => {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.sqrt(Math.random());
                    return Math.sin(angle) * r * b;
                },
                duration: () => gsap.utils.random(0.8, 1.5),
                ease: "power2.inOut",
            });

            const blockTweens = blocks.map((block, i) =>
                gsap.to(block, {
                    y: gsap.utils.random(10, 25),
                    repeat: -1,
                    yoyo: true,
                    duration: gsap.utils.random(4, 7),
                    ease: "sine.inOut",
                    repeatDelay: gsap.utils.random(0.2, 0.8),
                    delay: i * 0.3,
                    force3D: true,
                    paused: true,
                })
            );

            const allAnimations = [pupilTl, ...blockTweens];

            const trigger = ScrollTrigger.create({
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                onToggle: ({ isActive }) => {
                    allAnimations.forEach((anim) => (isActive ? anim.play() : anim.pause()));
                },
            });

            return () => {
                trigger.kill();
                allAnimations.forEach((anim) => anim.kill());
            };
        },
        { scope: containerRef }
    );

    const eyelashTypes = ["type-1", "type-2", "type-3"];
    const blockPositions = ["top-left", "top-right", "bottom-left", "bottom-right"];

    return (
        <div className={style["eye"]} ref={containerRef}>
            {blockPositions.map((pos, index) => (
                <div
                    key={pos}
                    ref={(el) => {
                        if (el) blocksRefs.current[index] = el;
                    }}
                    className={`${style["eye__block"]} ${style[`eye__block--${pos}`]}`}
                />
            ))}

            <div className={style["eye__wrapper"]}>
                {eyelashTypes.map((type) => (
                    <div
                        key={type}
                        className={`${style["eye__eyelash"]} ${style[`eye__eyelash--${type}`]}`}
                    />
                ))}

                <div className={style["eye__sclera"]} ref={scleraRef}>
                    <div className={style["eye__pupil"]} ref={pupilRef} />
                </div>
            </div>
        </div>
    );
};

export const MemoizedEye = React.memo(Eye);
