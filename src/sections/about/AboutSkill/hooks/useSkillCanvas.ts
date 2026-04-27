"use client";

import { useEffect } from "react";
import * as THREE from "three";
import {
    generateGoldenSphereCube,
    createSkillPoints,
    findNearestNeighbors,
    createSvgTexture,
    CONFIG,
    type SkillPoint,
} from "../utils/sphereUtils";

interface UseSkillCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    tooltipRef: React.RefObject<HTMLDivElement | null>;
}

const ARC_STEPS = 28;

const readColor = (name: string, fallback: string) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    if (v.startsWith("rgb")) {
        const m = v.match(/[\d.]+/g);
        if (m) {
            const [r, g, b] = m.map((n) => Math.round(parseFloat(n)));
            return (r << 16) | (g << 8) | b;
        }
    }
    return parseInt(v.replace(/^#/, "0x"), 16);
};

const makeCurvedGeometry = (a: THREE.Vector3, b: THREE.Vector3) => {
    const v1 = a.clone().normalize();
    const v2 = b.clone().normalize();
    const dot = Math.min(Math.max(v1.dot(v2), -1), 1);
    const theta = Math.acos(dot);
    const pts: THREE.Vector3[] = [];
    if (theta < 1e-4) {
        pts.push(a.clone(), b.clone());
    } else {
        const sinTheta = Math.sin(theta);
        for (let i = 0; i <= ARC_STEPS; i++) {
            const t = i / ARC_STEPS;
            const w1 = Math.sin((1 - t) * theta) / sinTheta;
            const w2 = Math.sin(t * theta) / sinTheta;
            pts.push(
                new THREE.Vector3(
                    (v1.x * w1 + v2.x * w2) * CONFIG.RADIUS,
                    (v1.y * w1 + v2.y * w2) * CONFIG.RADIUS,
                    (v1.z * w1 + v2.z * w2) * CONFIG.RADIUS
                )
            );
        }
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
};

export function useSkillCanvas({ canvasRef, tooltipRef }: UseSkillCanvasProps) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        const deviceMemory =
            (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? Infinity;
        const hwConcurrency = navigator.hardwareConcurrency ?? Infinity;
        let enableAnimation = !prefersReducedMotion && deviceMemory >= 1.5 && hwConcurrency > 2;

        // --- scene ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 8;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);

        const group = new THREE.Group();
        scene.add(group);
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const pointLight = new THREE.PointLight(0xffffff, 0.9);
        pointLight.position.set(10, 10, 15);
        scene.add(pointLight);

        // --- data ---
        const skillPoints = createSkillPoints(generateGoldenSphereCube(CONFIG.SPHERE_POINT_COUNT));
        const neighborIndices = findNearestNeighbors(skillPoints);

        const particles: THREE.Sprite[] = [];
        const lines: THREE.Line[] = [];

        skillPoints.forEach(async (skillPoint, index) => {
            const tex = new THREE.CanvasTexture(await createSvgTexture(skillPoint.svgUrl));
            tex.magFilter = THREE.LinearFilter;
            tex.minFilter = THREE.LinearFilter;
            tex.flipY = false;
            tex.center.set(0.5, 0.5);
            tex.rotation = Math.PI;
            tex.wrapS = THREE.RepeatWrapping;
            tex.repeat.x = -1;
            tex.needsUpdate = true;

            const material = new THREE.SpriteMaterial({
                map: tex,
                sizeAttenuation: true,
                opacity: 0.8,
            });
            material.userData = { baseOpacity: 0.8 };
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(skillPoint.position);
            sprite.scale.set(CONFIG.ICON_SIZE, CONFIG.ICON_SIZE, 1);
            sprite.userData = { skillPoint, index };
            group.add(sprite);
            particles.push(sprite);
        });

        const cssLineColor = readColor("--skill-line-color", "#000000");
        const cssLineActive = readColor("--skill-line-active-color", "#0080ff");
        const cssLineFront = readColor("--skill-line-front-color", "#3388ff");

        neighborIndices.forEach((neighbors, i) => {
            neighbors.forEach((j) => {
                if (i >= j) return;
                const line = new THREE.Line(
                    makeCurvedGeometry(skillPoints[i].position, skillPoints[j].position),
                    new THREE.LineBasicMaterial({
                        color: cssLineColor,
                        transparent: true,
                        opacity: 0.6,
                    })
                );
                line.userData = { startIdx: i, endIdx: j };
                group.add(line);
                lines.push(line);
            });
        });

        // --- interaction state ---
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let activeIndex = -1;
        let isMouseInside = false;
        let mouseDown = false;
        const mouseDrag = { x: 0, y: 0 };
        let canvasScale = 1;
        const clickAnim = {
            active: false,
            start: new THREE.Quaternion(),
            target: new THREE.Quaternion(),
            startTime: 0,
        };

        // --- resize ---
        const computeScale = (w: number, h: number) => {
            if (isTouchDevice) return 1.2;
            return Math.max(0.45, Math.min(1.2, Math.min(w, h) / 600));
        };

        const handleResize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (!w || !h) return;
            canvasScale = computeScale(w, h);
            camera.aspect = w / h;
            camera.position.z = 18 / canvasScale;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        };

        const ro = new ResizeObserver(handleResize);
        ro.observe(canvas);
        handleResize();

        // --- events ---
        const handleMouseDown = (e: MouseEvent) => {
            mouseDown = true;
            mouseDrag.x = e.clientX;
            mouseDrag.y = e.clientY;
        };
        const handleMouseUp = () => {
            mouseDown = false;
        };
        const handleMouseEnter = () => {
            isMouseInside = true;
        };
        const handleMouseLeave = () => {
            isMouseInside = false;
            activeIndex = -1;
            if (tooltipRef.current) tooltipRef.current.style.display = "none";
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isTouchDevice || !isMouseInside) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            if (mouseDown) {
                const dx = e.clientX - mouseDrag.x;
                const dy = e.clientY - mouseDrag.y;
                const qY = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    dx * 0.01
                );
                const qX = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    dy * 0.01
                );
                group.quaternion.multiply(qY).multiply(qX);
                mouseDrag.x = e.clientX;
                mouseDrag.y = e.clientY;
            }

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(particles);
            const hovered = intersects[0]?.object as THREE.Sprite | undefined;
            activeIndex = hovered ? hovered.userData.index : -1;

            if (tooltipRef.current) {
                if (hovered) {
                    tooltipRef.current.textContent = hovered.userData.skillPoint.name;
                    tooltipRef.current.style.display = "block";
                    tooltipRef.current.style.left = e.clientX + 12 + "px";
                    tooltipRef.current.style.top = e.clientY + 12 + "px";
                } else {
                    tooltipRef.current.style.display = "none";
                }
            }
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
            const intersects = raycaster.intersectObjects(particles);
            if (!intersects.length) return;
            const sp = (intersects[0].object as THREE.Sprite).userData.skillPoint as SkillPoint;
            const posNorm = sp.position.clone().normalize();
            clickAnim.active = true;
            clickAnim.start = group.quaternion.clone();
            clickAnim.target = new THREE.Quaternion().setFromUnitVectors(
                posNorm,
                new THREE.Vector3(0, 0, 1)
            );
            clickAnim.startTime = Date.now();
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("click", handleClick);
        canvas.addEventListener("mouseenter", handleMouseEnter);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        // --- battery ---
        const nb = navigator as Navigator & {
            getBattery?: () => Promise<{ level?: number; charging?: boolean }>;
        };
        nb.getBattery?.().then((b) => {
            if (b.level !== undefined && b.level <= 0.2 && !b.charging) {
                enableAnimation = false;
                renderer.render(scene, camera);
            }
        });

        // --- animate ---
        const targetFPS = hwConcurrency <= 4 ? 30 : 60;
        const frameInterval = 1000 / targetFPS;
        let lastFrame = performance.now();
        let animationId: number | null = null;

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            if (!enableAnimation) return;
            const now = performance.now();
            if (now - lastFrame < frameInterval) return;
            lastFrame = now;

            if (clickAnim.active) {
                const p = Math.min(
                    (Date.now() - clickAnim.startTime) / CONFIG.CLICK_ANIMATION_DURATION,
                    1
                );
                const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
                group.quaternion.copy(clickAnim.start.clone().slerp(clickAnim.target, ease));
                if (p >= 1) clickAnim.active = false;
            } else if (!mouseDown) {
                group.quaternion.multiply(
                    new THREE.Quaternion().setFromAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        CONFIG.AUTO_ROTATION_SPEED
                    )
                );
            }

            const frontSet = new Set<number>();
            const q = group.quaternion;

            particles.forEach((sprite) => {
                const wp = sprite.position.clone().applyQuaternion(q);
                const isFront = wp.z > 0;
                const idx = sprite.userData.index as number;
                if (isFront) frontSet.add(idx);

                const depth = (wp.z + CONFIG.RADIUS) / (2 * CONFIG.RADIUS);
                const s = CONFIG.ICON_SIZE * (0.5 + depth * 0.5) * canvasScale;
                sprite.scale.set(s, s, 1);

                const material = sprite.material as THREE.SpriteMaterial;
                const baseOpacity = material.userData?.baseOpacity ?? 0.8;
                const isCurrent = activeIndex === idx;
                material.opacity =
                    activeIndex >= 0
                        ? isCurrent
                            ? 1
                            : isFront
                              ? 0.5
                              : 0.2
                        : isFront
                          ? baseOpacity
                          : baseOpacity * 0.5;
                material.needsUpdate = true;
            });

            lines.forEach((line) => {
                const { startIdx, endIdx } = line.userData;
                const material = line.material as THREE.LineBasicMaterial;
                const isHovered =
                    activeIndex >= 0 && (startIdx === activeIndex || endIdx === activeIndex);
                const bothFront = frontSet.has(startIdx) && frontSet.has(endIdx);

                if (isHovered) {
                    material.color.setHex(cssLineActive);
                    material.opacity = 1;
                } else if (bothFront) {
                    material.color.setHex(cssLineFront);
                    material.opacity = 0.6;
                } else {
                    material.color.setHex(cssLineColor);
                    material.opacity = 0.12;
                }
                material.needsUpdate = true;
            });

            renderer.render(scene, camera);
        };

        const start = () => {
            if (!enableAnimation) {
                renderer.render(scene, camera);
                return;
            }
            if (!animationId) animate();
        };
        const stop = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };

        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("mouseenter", handleMouseEnter);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            ro.disconnect();
            observer.disconnect();
            stop();

            particles.forEach((s) => {
                const m = s.material as THREE.SpriteMaterial;
                m.map?.dispose();
                m.dispose();
            });
            lines.forEach((l) => {
                (l.material as THREE.LineBasicMaterial).dispose();
                l.geometry.dispose();
            });
            renderer.dispose();
        };
    }, [canvasRef, tooltipRef]);
}
