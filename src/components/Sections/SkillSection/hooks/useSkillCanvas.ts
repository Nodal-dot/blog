"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
    generateGoldenSphereCube,
    createSkillPoints,
    findNearestNeighbors,
    createSvgTexture,
    CONFIG,
    type SkillPoint,
} from "../utils/sphereUtils";
import { useTheme } from "@/providers/theme/ThemeProvider";

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
    const { theme } = useTheme();
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);
    const particlesRef = useRef<THREE.Sprite[]>([]);
    const linesRef = useRef<THREE.LineSegments[]>([]);
    const skillPointsRef = useRef<SkillPoint[]>([]);
    const neighborIndicesRef = useRef<number[][]>([]);
    const activePointRef = useRef<SkillPoint | null>(null);
    const activeIndexRef = useRef<number>(-1);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const animationRef = useRef<number | null>(null);
    const resizeTimeoutRef = useRef<number | null>(null);
    const canvasScaleRef = useRef<number>(1);

    const spriteIndicesRef = useRef<Map<SkillPoint, number>>(new Map());
    const mouseDownRef = useRef(false);
    const mouseDragRef = useRef({ x: 0, y: 0 });
    const clickAnimationRef = useRef<AnimationState>({
        isAnimating: false,
        startQuat: new THREE.Quaternion(),
        targetQuat: new THREE.Quaternion(),
        startTime: 0,
        duration: CONFIG.CLICK_ANIMATION_DURATION,
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvasElement = canvasRef.current;
        const particleSprites = particlesRef.current;
        const lineSegments = linesRef.current;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 18;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;

        const group = new THREE.Group();
        scene.add(group);
        groupRef.current = group;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.9);
        pointLight.position.set(10, 10, 15);
        scene.add(pointLight);

        const positions = generateGoldenSphereCube(CONFIG.SPHERE_POINT_COUNT);
        const skillPoints = createSkillPoints(positions);
        skillPointsRef.current = skillPoints;
        neighborIndicesRef.current = findNearestNeighbors(skillPoints);

        skillPoints.forEach(async (skillPoint, index) => {
            const canvas = await createSvgTexture(skillPoint.svgUrl);
            skillPoint.canvasTexture = canvas;

            const texture = new THREE.CanvasTexture(canvas);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;

            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                sizeAttenuation: true,
                opacity: 0.8,
            });
            spriteMaterial.userData = { baseOpacity: 0.8 };
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.copy(skillPoint.position);
            sprite.scale.set(CONFIG.ICON_SIZE, CONFIG.ICON_SIZE, 1);
            sprite.userData = { skillPoint, index };

            group.add(sprite);
            particlesRef.current.push(sprite);
            spriteIndicesRef.current.set(skillPoint, index);
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

        neighborIndicesRef.current.forEach((neighbors, i) => {
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
                    linesRef.current.push(line as unknown as THREE.LineSegments);
                }
            });
        });

        const computeCanvasScale = (width: number, height: number) => {
            const minSide = Math.min(width, height);
            const scale = Math.max(0.45, Math.min(1.2, minSide / 600));
            return scale;
        };

        const handleResizeImmediate = () => {
            if (!canvasRef.current) return;
            const width = canvasRef.current.clientWidth;
            const height = canvasRef.current.clientHeight;
            canvasScaleRef.current = computeCanvasScale(width, height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            camera.position.z = 18 / canvasScaleRef.current;

            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
        };

        const debouncedResize = () => {
            if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = window.setTimeout(() => {
                handleResizeImmediate();
                resizeTimeoutRef.current = null;
            }, 150);
        };

        handleResizeImmediate();
        window.addEventListener("resize", debouncedResize);

        const handleMouseDown = (event: MouseEvent) => {
            mouseDownRef.current = true;
            mouseDragRef.current = { x: event.clientX, y: event.clientY };
        };

        const handleMouseUp = () => {
            mouseDownRef.current = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            if (mouseDownRef.current && groupRef.current) {
                const deltaX = event.clientX - mouseDragRef.current.x;
                const deltaY = event.clientY - mouseDragRef.current.y;

                const qY = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    deltaX * 0.01
                );
                const qX = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    deltaY * 0.01
                );
                groupRef.current.quaternion.multiply(qY);
                groupRef.current.quaternion.multiply(qX);

                mouseDragRef.current = { x: event.clientX, y: event.clientY };
            }

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const intersects = raycasterRef.current.intersectObjects(particlesRef.current);

            let hovered: SkillPoint | null = null;
            let hoveredIndex = -1;

            if (intersects.length > 0) {
                const obj = intersects[0].object as THREE.Sprite;
                hovered = obj.userData.skillPoint;
                hoveredIndex = obj.userData.index;
            }

            activePointRef.current = hovered;
            activeIndexRef.current = hoveredIndex;
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

            linesRef.current.forEach((line) => {
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

            particlesRef.current.forEach((sprite) => {
                const material = sprite.material as THREE.SpriteMaterial;
                const isCurrent = hoveredIndex === sprite.userData.index;
                material.opacity = isCurrent ? 1 : (material.userData?.baseOpacity ?? 0.8);
                material.needsUpdate = true;
            });
        };

        const handleClick = (event: MouseEvent) => {
            if (!canvasRef.current || !groupRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
            const intersects = raycasterRef.current.intersectObjects(particlesRef.current);

            if (intersects.length > 0) {
                const obj = intersects[0].object as THREE.Sprite;
                const skillPoint = obj.userData.skillPoint as SkillPoint;

                const posNorm = skillPoint.position.clone().normalize();
                const targetVec = new THREE.Vector3(0, 0, 1);
                const targetQuat = new THREE.Quaternion().setFromUnitVectors(posNorm, targetVec);

                clickAnimationRef.current.isAnimating = true;
                clickAnimationRef.current.startQuat = groupRef.current.quaternion.clone();
                clickAnimationRef.current.targetQuat = targetQuat;
                clickAnimationRef.current.startTime = Date.now();
                clickAnimationRef.current.duration = CONFIG.CLICK_ANIMATION_DURATION;
            }
        };

        canvasRef.current?.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        canvasRef.current?.addEventListener("click", handleClick);

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            if (groupRef.current) {
                if (clickAnimationRef.current.isAnimating) {
                    const elapsed = Date.now() - clickAnimationRef.current.startTime;
                    const progress = Math.min(elapsed / clickAnimationRef.current.duration, 1);
                    const easeProgress =
                        progress < 0.5
                            ? 2 * progress * progress
                            : -1 + (4 - 2 * progress) * progress;

                    const q = clickAnimationRef.current.startQuat
                        .clone()
                        .slerp(clickAnimationRef.current.targetQuat, easeProgress);
                    groupRef.current.quaternion.copy(q);

                    if (progress >= 1) {
                        clickAnimationRef.current.isAnimating = false;
                    }
                } else if (!mouseDownRef.current) {
                    const q = new THREE.Quaternion().setFromAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        CONFIG.AUTO_ROTATION_SPEED
                    );
                    groupRef.current.quaternion.multiply(q);
                }

                const frontSet = new Set<number>();
                particlesRef.current.forEach((sprite) => {
                    const wp = sprite.position
                        .clone()
                        .applyQuaternion(groupRef.current!.quaternion);
                    if (wp.z > 0) frontSet.add(sprite.userData.index);
                });

                particlesRef.current.forEach((sprite) => {
                    const wp = sprite.position
                        .clone()
                        .applyQuaternion(groupRef.current!.quaternion);
                    const worldZ = wp.z;
                    const depthFactor = (worldZ + CONFIG.RADIUS) / (2 * CONFIG.RADIUS);
                    const scaleFactor = 0.5 + depthFactor * 0.5;
                    const spriteScale = CONFIG.ICON_SIZE * scaleFactor * canvasScaleRef.current;
                    sprite.scale.set(spriteScale, spriteScale, 1);

                    const material = sprite.material as THREE.SpriteMaterial;
                    const baseOpacity = material.userData?.baseOpacity ?? 0.8;
                    const idx = sprite.userData.index as number;
                    const hoveredIdx = activeIndexRef.current;
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

                const hoveredIdx = activeIndexRef.current;
                linesRef.current.forEach((line) => {
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

            renderer.render(scene, camera);
        };

        // Функции для запуска и остановки анимации
        const startAnimation = () => {
            if (animationRef.current === null) {
                animate();
            }
        };

        const stopAnimation = () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
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
            if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
            observer.disconnect();
            stopAnimation();

            particleSprites.forEach((sprite) => {
                const material = sprite.material as THREE.SpriteMaterial;
                material.map?.dispose();
                material.dispose();
            });

            lineSegments.forEach((line) => {
                (line.material as THREE.LineBasicMaterial).dispose();
                line.geometry.dispose();
            });

            renderer.dispose();
        };
    }, [canvasRef, tooltipRef, containerRef, theme]);
}
