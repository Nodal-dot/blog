"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { debounce } from "@/shared/lib/debounce";
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
    containerRef?: React.RefObject<HTMLDivElement | null>;
}

interface AnimationState {
    isAnimating: boolean;
    startQuat: THREE.Quaternion;
    targetQuat: THREE.Quaternion;
    startTime: number;
    duration: number;
}

export function useSkillCanvas({ canvasRef, tooltipRef, containerRef }: UseSkillCanvasProps) {
    type State = {
        scene?: THREE.Scene | null;
        camera?: THREE.PerspectiveCamera | null;
        renderer?: THREE.WebGLRenderer | null;
        group?: THREE.Group | null;
        particles: THREE.Sprite[];
        lines: THREE.LineSegments[];
        skillPoints: SkillPoint[];
        neighborIndices: number[][];
        activePoint?: SkillPoint | null;
        activeIndex: number;
        animationId?: number | null;
        resizeTimeout?: number | null;
        enableAnimation?: boolean;
        isMouseInside: boolean;
        canvasScale: number;
        isTouchDevice: boolean;
        spriteIndices: Map<SkillPoint, number>;
        mouseDown: boolean;
        mouseDrag: { x: number; y: number };
        clickAnimation: AnimationState;
    };

    const stateRef = useRef<State>({
        particles: [],
        lines: [],
        skillPoints: [],
        neighborIndices: [],
        activeIndex: -1,
        isMouseInside: false,
        canvasScale: 1,
        isTouchDevice: false,
        spriteIndices: new Map(),
        mouseDown: false,
        mouseDrag: { x: 0, y: 0 },
        clickAnimation: {
            isAnimating: false,
            startQuat: new THREE.Quaternion(),
            targetQuat: new THREE.Quaternion(),
            startTime: 0,
            duration: CONFIG.CLICK_ANIMATION_DURATION,
        },
    });

    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    useEffect(() => {
        stateRef.current.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }, []);
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvasElement = canvasRef.current;
        const particles = stateRef.current.particles;
        const lines = stateRef.current.lines;
        let animationIdLocal: number | null = null;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current!.clientWidth / canvasRef.current!.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current!,
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
        renderer.setClearColor(0x000000, 0);

        const group = new THREE.Group();
        scene.add(group);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.9);
        pointLight.position.set(10, 10, 15);
        scene.add(pointLight);

        const positions = generateGoldenSphereCube(CONFIG.SPHERE_POINT_COUNT);
        const skillPoints = createSkillPoints(positions);
        stateRef.current.skillPoints = skillPoints;
        stateRef.current.neighborIndices = findNearestNeighbors(skillPoints);

        stateRef.current.scene = scene;
        stateRef.current.camera = camera;
        stateRef.current.renderer = renderer;
        stateRef.current.group = group;
        const rendererLocal = renderer;

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const deviceMemory =
            (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? Infinity;
        const hwConcurrency = (navigator as Navigator).hardwareConcurrency ?? Infinity;
        let enableAnimation = true;
        if (prefersReducedMotion) enableAnimation = false;
        if (deviceMemory < 1.5) enableAnimation = false;
        if (hwConcurrency <= 2) enableAnimation = false;
        stateRef.current.enableAnimation = enableAnimation;

        const nb = navigator as Navigator & {
            getBattery?: () => Promise<{ level?: number; charging?: boolean }>;
        };
        if (nb.getBattery) {
            nb.getBattery().then((batt) => {
                if (batt.level !== undefined && batt.level <= 0.2 && !batt.charging) {
                    stateRef.current.enableAnimation = false;
                    if (animationIdLocal) {
                        cancelAnimationFrame(animationIdLocal);
                        animationIdLocal = null;
                    }
                    stateRef.current.renderer?.render(
                        stateRef.current.scene!,
                        stateRef.current.camera!
                    );
                }
            });
        }

        skillPoints.forEach(async (skillPoint, index) => {
            const canvas = await createSvgTexture(skillPoint.svgUrl);
            skillPoint.canvasTexture = canvas;

            const texture = new THREE.CanvasTexture(canvas);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.flipY = false;
            texture.premultiplyAlpha = false;
            texture.center.set(0.5, 0.5);
            texture.rotation = Math.PI;
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.x = -1;
            texture.needsUpdate = true;

            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                sizeAttenuation: true,
                opacity: 0.8,
            });

            spriteMaterial.rotation = 0;
            spriteMaterial.userData = { baseOpacity: 0.8 };
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.rotation.set(0, 0, 0);
            sprite.position.copy(skillPoint.position);
            sprite.scale.set(CONFIG.ICON_SIZE, CONFIG.ICON_SIZE, 1);
            sprite.userData = { skillPoint, index };

            group.add(sprite);
            stateRef.current.particles.push(sprite);
            stateRef.current.spriteIndices.set(skillPoint, index);
        });

        const readColor = (name: string, fallback: string) => {
            const styles = getComputedStyle(document.documentElement);
            let v = styles.getPropertyValue(name).trim();
            if (!v) {
                v = fallback;
            } else {
                if (v.startsWith("rgb")) {
                    const match = v.match(/[\d.]+/g);
                    if (match) {
                        const r = Math.round(parseFloat(match[0]));
                        const g = Math.round(parseFloat(match[1]));
                        const b = Math.round(parseFloat(match[2]));
                        v = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
                    }
                }
            }
            return parseInt(v.replace(/^#/, "0x"), 16);
        };

        const cssLineColor = readColor("--skill-line-color", "#000000");
        const cssLineActive = readColor("--skill-line-active-color", "#0080ff");
        const cssLineFront = readColor("--skill-line-front-color", "#3388ff");

        const ARC_STEPS = 28;

        const makeCurvedGeometry = (a: THREE.Vector3, b: THREE.Vector3) => {
            const v1 = a.clone().normalize();
            const v2 = b.clone().normalize();
            const dot = Math.min(Math.max(v1.dot(v2), -1), 1);
            const theta = Math.acos(dot);
            const pts: THREE.Vector3[] = [];
            if (theta < 1e-4) {
                pts.push(a.clone(), b.clone());
            } else {
                for (let i = 0; i <= ARC_STEPS; i++) {
                    const t = i / ARC_STEPS;
                    const sinTheta = Math.sin(theta);
                    const w1 = Math.sin((1 - t) * theta) / sinTheta;
                    const w2 = Math.sin(t * theta) / sinTheta;
                    const vec = new THREE.Vector3(
                        (v1.x * w1 + v2.x * w2) * CONFIG.RADIUS,
                        (v1.y * w1 + v2.y * w2) * CONFIG.RADIUS,
                        (v1.z * w1 + v2.z * w2) * CONFIG.RADIUS
                    );
                    pts.push(vec);
                }
            }
            return new THREE.BufferGeometry().setFromPoints(pts);
        };

        stateRef.current.neighborIndices.forEach((neighbors, i) => {
            neighbors.forEach((neighborIdx) => {
                if (i < neighborIdx) {
                    const geometry = makeCurvedGeometry(
                        skillPoints[i].position,
                        skillPoints[neighborIdx].position
                    );
                    const line = new THREE.Line(
                        geometry,
                        new THREE.LineBasicMaterial({
                            color: cssLineColor,
                            linewidth: 1,
                            transparent: true,
                            opacity: 0.6,
                        })
                    );
                    line.userData = { startIdx: i, endIdx: neighborIdx };
                    group.add(line);
                    stateRef.current.lines.push(line as unknown as THREE.LineSegments);
                }
            });
        });

        const computeCanvasScale = (width: number, height: number) => {
            if (stateRef.current.isTouchDevice) {
                return 1.2;
            }
            const minSide = Math.min(width, height);
            const scale = Math.max(0.45, Math.min(1.2, minSide / 600));
            return scale;
        };

        const handleResizeImmediate = () => {
            if (!canvasRef.current) return;
            const width = canvasRef.current.clientWidth;
            const height = canvasRef.current.clientHeight;
            stateRef.current.canvasScale = computeCanvasScale(width, height);

            stateRef.current.camera!.aspect = width / height;
            stateRef.current.camera!.updateProjectionMatrix();

            stateRef.current.camera!.position.z = 18 / stateRef.current.canvasScale;

            stateRef.current.renderer!.setSize(width, height);
            stateRef.current.renderer!.setPixelRatio(window.devicePixelRatio);
        };

        const debouncedResize = debounce(handleResizeImmediate, 150);

        handleResizeImmediate();
        window.addEventListener("resize", debouncedResize);

        const handleMouseDown = (event: MouseEvent) => {
            stateRef.current.mouseDown = true;
            stateRef.current.mouseDrag = { x: event.clientX, y: event.clientY };
        };

        const handleMouseUp = () => {
            stateRef.current.mouseDown = false;
        };
        const handleMouseEnter = () => {
            stateRef.current.isMouseInside = true;
        };

        const handleMouseLeave = () => {
            stateRef.current.isMouseInside = false;
            stateRef.current.activePoint = null;
            stateRef.current.activeIndex = -1;

            if (tooltipRef.current) {
                tooltipRef.current.style.display = "none";
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (stateRef.current.isTouchDevice) return;
            if (!canvasRef.current) return;
            if (!stateRef.current.isMouseInside) return;
            const rect = canvasRef.current.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            if (stateRef.current.mouseDown && stateRef.current.group) {
                const deltaX = event.clientX - stateRef.current.mouseDrag.x;
                const deltaY = event.clientY - stateRef.current.mouseDrag.y;

                const qY = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    deltaX * 0.01
                );
                const qX = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    deltaY * 0.01
                );
                stateRef.current.group!.quaternion.multiply(qY);
                stateRef.current.group!.quaternion.multiply(qX);

                stateRef.current.mouseDrag = { x: event.clientX, y: event.clientY };
            }

            raycasterRef.current.setFromCamera(mouseRef.current, stateRef.current.camera!);
            const intersects = raycasterRef.current.intersectObjects(stateRef.current.particles);

            let hovered: SkillPoint | null = null;
            let hoveredIndex = -1;

            if (intersects.length > 0) {
                const obj = intersects[0].object as THREE.Sprite;
                hovered = obj.userData.skillPoint;
                hoveredIndex = obj.userData.index;
            }

            stateRef.current.activePoint = hovered;
            stateRef.current.activeIndex = hoveredIndex;
            if (tooltipRef.current) {
                if (hovered) {
                    tooltipRef.current.textContent = hovered.name;
                    tooltipRef.current.style.display = "block";
                    tooltipRef.current.style.left = event.clientX + 12 + "px";
                    tooltipRef.current.style.top = event.clientY + 12 + "px";
                } else {
                    tooltipRef.current.style.display = "none";
                }
            }

            const connectedIndices = new Set<number>();

            stateRef.current.lines.forEach((line) => {
                const { startIdx, endIdx } = line.userData;
                const material = line.material as THREE.LineBasicMaterial;
                const isActive = hoveredIndex === startIdx || hoveredIndex === endIdx;
                material.color.setHex(isActive ? cssLineActive : cssLineColor);
                material.linewidth = isActive ? 3 : 1;
                material.opacity = isActive ? 1 : 0.4;
                material.needsUpdate = true;
                if (isActive) {
                    connectedIndices.add(startIdx);
                    connectedIndices.add(endIdx);
                }
            });
            stateRef.current.particles.forEach((sprite) => {
                const material = sprite.material as THREE.SpriteMaterial;
                const isCurrent = hoveredIndex === sprite.userData.index;
                material.opacity = isCurrent ? 1 : (material.userData?.baseOpacity ?? 0.8);
                material.needsUpdate = true;
            });
        };

        const handleClick = (event: MouseEvent) => {
            if (!canvasRef.current || !stateRef.current.group) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), stateRef.current.camera!);
            const intersects = raycasterRef.current.intersectObjects(stateRef.current.particles);

            if (intersects.length > 0) {
                const obj = intersects[0].object as THREE.Sprite;
                const skillPoint = obj.userData.skillPoint as SkillPoint;

                const posNorm = skillPoint.position.clone().normalize();
                const targetVec = new THREE.Vector3(0, 0, 1);
                const targetQuat = new THREE.Quaternion().setFromUnitVectors(posNorm, targetVec);

                stateRef.current.clickAnimation.isAnimating = true;
                stateRef.current.clickAnimation.startQuat =
                    stateRef.current.group!.quaternion.clone();
                stateRef.current.clickAnimation.targetQuat = targetQuat;
                stateRef.current.clickAnimation.startTime = Date.now();
                stateRef.current.clickAnimation.duration = CONFIG.CLICK_ANIMATION_DURATION;
            }
        };

        canvasRef.current?.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        canvasRef.current?.addEventListener("click", handleClick);
        canvasRef.current?.addEventListener("mouseenter", handleMouseEnter);
        canvasRef.current?.addEventListener("mouseleave", handleMouseLeave);
        const targetFPS = hwConcurrency <= 4 ? 30 : 60;
        let lastFrame = performance.now();

        const animate = () => {
            animationIdLocal = requestAnimationFrame(animate);
            stateRef.current.animationId = animationIdLocal;
            if (!stateRef.current.enableAnimation) return;
            const now = performance.now();
            const elapsed = now - lastFrame;
            if (elapsed < 1000 / targetFPS) return;
            lastFrame = now;

            if (stateRef.current.group) {
                if (stateRef.current.clickAnimation.isAnimating) {
                    const elapsed = Date.now() - stateRef.current.clickAnimation.startTime;
                    const progress = Math.min(
                        elapsed / stateRef.current.clickAnimation.duration,
                        1
                    );
                    const easeProgress =
                        progress < 0.5
                            ? 2 * progress * progress
                            : -1 + (4 - 2 * progress) * progress;

                    const q = stateRef.current.clickAnimation.startQuat
                        .clone()
                        .slerp(stateRef.current.clickAnimation.targetQuat, easeProgress);
                    stateRef.current.group!.quaternion.copy(q);

                    if (progress >= 1) {
                        stateRef.current.clickAnimation.isAnimating = false;
                    }
                } else if (!stateRef.current.mouseDown) {
                    const q = new THREE.Quaternion().setFromAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        CONFIG.AUTO_ROTATION_SPEED
                    );
                    stateRef.current.group!.quaternion.multiply(q);
                }

                const frontSet = new Set<number>();
                stateRef.current.particles.forEach((sprite) => {
                    const wp = sprite.position
                        .clone()
                        .applyQuaternion(stateRef.current.group!.quaternion);
                    if (wp.z > 0) frontSet.add(sprite.userData.index);
                });

                stateRef.current.particles.forEach((sprite) => {
                    const wp = sprite.position
                        .clone()
                        .applyQuaternion(stateRef.current.group!.quaternion);
                    const worldZ = wp.z;
                    const depthFactor = (worldZ + CONFIG.RADIUS) / (2 * CONFIG.RADIUS);
                    const scaleFactor = 0.5 + depthFactor * 0.5;
                    const spriteScale =
                        CONFIG.ICON_SIZE * scaleFactor * stateRef.current.canvasScale;
                    sprite.scale.set(spriteScale, spriteScale, 1);

                    const material = sprite.material as THREE.SpriteMaterial;
                    const baseOpacity = material.userData?.baseOpacity ?? 0.8;
                    const idx = sprite.userData.index as number;
                    const hoveredIdx = stateRef.current.activeIndex;
                    const isCurrent = hoveredIdx === idx;
                    const isFront = worldZ > 0;

                    let opacity = baseOpacity;
                    if (hoveredIdx >= 0) {
                        opacity = isCurrent ? 1.0 : isFront ? 0.5 : 0.2;
                    } else {
                        opacity = isFront ? baseOpacity : baseOpacity * 0.5;
                    }

                    material.opacity = opacity;
                    material.needsUpdate = true;
                });

                const hoveredIdx = stateRef.current.activeIndex;
                stateRef.current.lines.forEach((line) => {
                    const { startIdx, endIdx } = line.userData;
                    const material = line.material as THREE.LineBasicMaterial;
                    const bothFront = frontSet.has(startIdx) && frontSet.has(endIdx);
                    const isDirectOfHovered =
                        hoveredIdx >= 0 && (startIdx === hoveredIdx || endIdx === hoveredIdx);

                    if (isDirectOfHovered) {
                        material.color.setHex(cssLineActive);
                        material.opacity = 1;
                        material.linewidth = 3;
                    } else if (bothFront) {
                        material.color.setHex(cssLineFront);
                        material.opacity = 0.6;
                        material.linewidth = 1;
                    } else {
                        material.color.setHex(cssLineColor);
                        material.opacity = 0.12;
                        material.linewidth = 1;
                    }
                    material.needsUpdate = true;
                });
            }

            stateRef.current.renderer!.render(stateRef.current.scene!, stateRef.current.camera!);
        };

        const startAnimation = () => {
            if (stateRef.current.enableAnimation) {
                if (!animationIdLocal) animate();
            } else {
                stateRef.current.renderer?.render(
                    stateRef.current.scene!,
                    stateRef.current.camera!
                );
            }
        };

        const stopAnimation = () => {
            if (animationIdLocal) {
                cancelAnimationFrame(animationIdLocal);
                animationIdLocal = null;
            }
            stateRef.current.animationId = null;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startAnimation();
                    } else {
                        stopAnimation();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(canvasRef.current!);

        return () => {
            canvasElement?.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            canvasElement?.removeEventListener("click", handleClick);
            window.removeEventListener("resize", debouncedResize);
            debouncedResize.cancel();
            observer.disconnect();
            stopAnimation();

            particles.forEach((sprite) => {
                const material = sprite.material as THREE.SpriteMaterial;
                material.map?.dispose();
                material.dispose();
            });

            lines.forEach((line) => {
                (line.material as THREE.LineBasicMaterial).dispose();
                line.geometry.dispose();
            });

            rendererLocal?.dispose();
        };
    }, [canvasRef, tooltipRef, containerRef]);
}
