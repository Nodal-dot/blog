"use client";

import React, { useEffect, useRef, useState, type FC } from "react";
import gsap from "gsap";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import styles from "./Workspace.module.scss";
import { classNames } from "@/utils/classNames";
const SMOKE_COUNT = 6;

const SOURCE_CODE = [
    "const developer = {",
    "  name: 'NodalDOT',",
    "  status: 'Coding',",
    "  coffee: true",
    "};",
    "",
    "async function deploy() {",
    "  await developer.code();",
    "  console.log('Production ready!');",
    "}",
    "",
    "// Success!",
];

export const Workspace: FC = () => {
    const [lightOn, setLightOn] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLElement>(null);
    const pupilRef = useRef<SVGGElement>(null);
    const lidRef = useRef<SVGRectElement>(null);
    const smokeRefs = useRef<HTMLDivElement[]>([]);
    const codeContainerRef = useRef<HTMLDivElement>(null);

    const isMounted = useRef(false);

    const typeWriter = () => {
        if (!codeRef.current) return;

        const fullText = SOURCE_CODE.join("\n");
        let index = 0;

        const addChar = () => {
            if (!codeRef.current) return;

            const currentText = fullText.slice(0, index + 1);

            codeRef.current.innerHTML = Prism.highlight(
                currentText,
                Prism.languages.javascript,
                "javascript"
            );

            index++;
            if (index < fullText.length) {
                requestAnimationFrame(addChar);
            }
        };

        addChar();
    };

    const startEyeAnimation = () => {
        if (!lidRef.current || !pupilRef.current) return;

        const blinkCycle = () => {
            gsap.fromTo(
                lidRef.current,
                { height: 0 },
                {
                    height: 110,
                    duration: 0.8,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        gsap.delayedCall(gsap.utils.random(2, 4), blinkCycle);
                    },
                }
            );
        };
        blinkCycle();

        const movePupil = () => {
            gsap.to(pupilRef.current, {
                x: gsap.utils.random(-10, 10),
                y: gsap.utils.random(-10, 10),
                duration: gsap.utils.random(1, 2),
                ease: "power1.inOut",
                onComplete: movePupil,
            });
        };
        movePupil();
    };

    const handleScreenClick = () => {
        typeWriter();

        if (lidRef.current) {
            gsap.fromTo(
                lidRef.current,
                { height: 0 },
                { height: 110, duration: 0.3, ease: "power2.inOut", yoyo: true, repeat: 1 }
            );
        }
    };
    const prepareCodeLayout = () => {
        if (!codeRef.current || !codeContainerRef.current) return;

        const fullText = SOURCE_CODE.join("\n");

        codeRef.current.innerHTML = Prism.highlight(
            fullText,
            Prism.languages.javascript,
            "javascript"
        );

        requestAnimationFrame(() => {
            if (!codeContainerRef.current) return;

            const height = codeContainerRef.current.scrollHeight;

            codeContainerRef.current.style.height = `${height}px`;

            codeRef.current!.innerHTML = "";
        });
    };

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        prepareCodeLayout();

        requestAnimationFrame(() => {
            typeWriter();
            startEyeAnimation();
        });

        smokeRefs.current.forEach((smoke, i) => {
            const tl = gsap.timeline({
                delay: i * 0.5,
                repeat: -1,
            });

            tl.fromTo(
                smoke,
                {
                    y: 0,
                    opacity: 0,
                    scaleY: 0.4,
                    scaleX: 0.6,
                },
                {
                    opacity: 0.7,
                    duration: 0.8,
                    ease: "sine.out",
                }
            )
                .to(
                    smoke,
                    {
                        y: -80,
                        scaleY: 1.6,
                        scaleX: 2.2,
                        rotate: gsap.utils.random(-12, 12),
                        duration: 3.5,
                        ease: "sine.out",
                    },
                    "<"
                )
                .to(
                    smoke,
                    {
                        x: gsap.utils.random(-18, 18),
                        duration: 1.6,
                        repeat: 2,
                        yoyo: true,
                        ease: "sine.inOut",
                    },
                    "<"
                )
                .to(
                    smoke,
                    {
                        opacity: 0,
                        duration: 1.2,
                        ease: "sine.in",
                    },
                    "-=1"
                );
        });
    }, []);

    return (
        <div
            ref={wrapperRef}
            className={classNames(styles["workspace"], {
                [styles["workspace--light-on"]]: lightOn,
            })}
        >
            <div className={styles["workspace__monitor-group"]}>
                <div
                    className={styles["workspace__light-beam"]}
                    style={{ opacity: lightOn ? 1 : 0 }}
                />

                <div
                    className={styles["workspace__screen-bar"]}
                    onClick={() => setLightOn((v) => !v)}
                />

                <div className={styles["workspace__monitor-frame"]}>
                    <div className={styles["workspace__screen"]} onClick={handleScreenClick}>
                        <div ref={codeContainerRef} className={styles["workspace__code-container"]}>
                            <pre>
                                <code ref={codeRef} className="language-javascript" />
                            </pre>
                        </div>

                        <div className={styles["workspace__eye-widget"]}>
                            <svg viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    className={styles["workspace__eye-ball"]}
                                />
                                <g ref={pupilRef}>
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="22"
                                        className={styles["workspace__pupil"]}
                                    />
                                </g>
                                <rect
                                    ref={lidRef}
                                    x={0}
                                    y={0}
                                    width={100}
                                    height={0}
                                    rx={55}
                                    className={styles["workspace__lid"]}
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles["workspace__stand-neck"]} />
                <div className={styles["workspace__stand-base"]} />
            </div>

            <div className={styles["workspace__mug-container"]}>
                <div className={styles["workspace__smoke-wrapper"]}>
                    {Array.from({ length: SMOKE_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                if (el) smokeRefs.current[i] = el;
                            }}
                            className={styles.workspace__smoke}
                            style={{ left: `${45 + i * 2}%` }}
                        />
                    ))}
                </div>

                <div className={styles["workspace__mug"]}>
                    <div className={styles["workspace__mug-handle"]} />
                </div>
            </div>

            <div className={styles["workspace__desk"]} />
        </div>
    );
};

export default Workspace;
