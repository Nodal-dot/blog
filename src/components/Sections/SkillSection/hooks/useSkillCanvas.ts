"use client";

import { useEffect, useRef, useState } from "react";
import {
    createSphere,
    fixNeighbors,
    project,
    slerp,
    CONFIG,
    SKILLS,
    type Point3D,
} from "../utils/sphereUtils";
import { useTheme } from "@/providers/theme/ThemeProvider";

export function useSkillCanvas(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    tooltipRef: React.RefObject<HTMLDivElement | null>
) {
    const { theme } = useTheme();
    const points = useRef<Point3D[]>([]);
    const mouse = useRef({ x: 0, y: 0 });
    const center = useRef({ x: 0, y: 0 });
    const isVisible = useRef(false);
    const animationRef = useRef<number | null>(null);
    const activePoint = useRef<Point3D | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            center.current.x = canvas.offsetWidth / 2;
            center.current.y = canvas.offsetHeight / 2;
        };
        resize();
        window.addEventListener("resize", resize);

        const getColors = () => {
            const styles = getComputedStyle(document.documentElement);
            return {
                line: styles.getPropertyValue("--skill-line-color").trim(),
                lineActive: styles.getPropertyValue("--skill-line-active-color").trim(),
            };
        };

        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        SKILLS.forEach(({ icon }, i) => {
            const img = new Image();
            img.src = icon;
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === SKILLS.length) setLoaded(true);
            };
            images[i] = img;
        });

        points.current = createSphere(CONFIG.POINT_COUNT, images);
        fixNeighbors(points.current);

        let rotation = 0;

        const render = () => {
            if (!loaded || !isVisible.current) {
                animationRef.current = null;
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = center.current.x;
            const cy = center.current.y;
            rotation += CONFIG.SPEED;

            points.current.forEach((p) => {
                const cos = Math.cos(rotation);
                const sin = Math.sin(rotation);
                const x = p.x0 * cos - p.z0 * sin;
                const z = p.x0 * sin + p.z0 * cos;
                const cosX = Math.cos(0.3);
                const sinX = Math.sin(0.3);

                p.y = p.y0 * cosX - z * sinX;
                p.z = p.y0 * sinX + z * cosX;
                p.x = x;

                const proj = project(p);
                if (proj) {
                    p.px = proj.x;
                    p.py = proj.y;
                    p.scale = proj.scale;
                }
            });

            const visible = points.current.filter(
                (p): p is Point3D & { px: number; py: number; scale: number } =>
                    p.px !== undefined && p.py !== undefined && p.scale !== undefined
            );

            const colors = getColors();

            visible.forEach((p) => {
                p.neighbors?.forEach((idx) => {
                    const q = points.current[idx];
                    const isActive = activePoint.current === p || activePoint.current === q;
                    ctx.beginPath();
                    for (let i = 0; i <= CONFIG.ARC_STEPS; i++) {
                        const t = i / CONFIG.ARC_STEPS;
                        const pt = slerp(p, q, t);
                        const s = CONFIG.FOV / (CONFIG.FOV + pt.z);
                        if (s <= 0) continue;

                        const x = cx + pt.x * s;
                        const y = cy + pt.y * s;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = isActive ? colors.lineActive : colors.line;
                    ctx.lineWidth = isActive ? 2 : 1;
                    ctx.stroke();
                });
            });

            visible.forEach((p) => {
                const size = CONFIG.ICON_SIZE * (p.scale ?? 1);
                ctx.globalAlpha = p === activePoint.current ? 1 : 0.8;
                ctx.drawImage(p.icon!, cx + p.px - size / 2, cy + p.py - size / 2, size, size);
            });

            const rect = canvas.getBoundingClientRect();
            const nearest =
                visible.find((p) => {
                    const dx = mouse.current.x - rect.left - (cx + p.px);
                    const dy = mouse.current.y - rect.top - (cy + p.py);
                    const dist = Math.hypot(dx, dy);
                    const size = CONFIG.ICON_SIZE * (p.scale ?? 1);
                    return dist < size / 2;
                }) ?? null;

            activePoint.current = nearest;

            if (tooltipRef.current) {
                if (nearest) {
                    tooltipRef.current.style.display = "block";
                    tooltipRef.current.textContent = nearest.name;
                    tooltipRef.current.style.left = mouse.current.x + 12 + "px";
                    tooltipRef.current.style.top = mouse.current.y + 12 + "px";
                } else {
                    tooltipRef.current.style.display = "none";
                }
            }

            animationRef.current = requestAnimationFrame(render);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isVisible.current = entry.isIntersecting;
                    if (isVisible.current && !animationRef.current) render();
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(canvas);

        const rectInit = canvas.getBoundingClientRect();
        if (rectInit.top < window.innerHeight && rectInit.bottom > 0) {
            isVisible.current = true;
            if (!animationRef.current) render();
        }

        canvas.addEventListener("mousemove", (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        });

        return () => {
            window.removeEventListener("resize", resize);
            observer.disconnect();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [canvasRef, tooltipRef, loaded, theme]);
}
