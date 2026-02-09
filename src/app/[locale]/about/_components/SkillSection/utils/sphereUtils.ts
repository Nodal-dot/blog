import * as THREE from "three";

export type SkillPoint = {
    position: THREE.Vector3;
    name: string;
    svgUrl: string;
    canvasTexture?: HTMLCanvasElement;
};

export const CONFIG = {
    RADIUS: 8,
    ICON_SIZE: 1.2,
    ROTATION_SPEED: 0.0003,
    SPHERE_POINT_COUNT: 50,
    CONNECT_NEIGHBORS: 6,
    LINE_COLOR: "#4a9eff",
    LINE_ACTIVE_COLOR: "#ff6b6b",
    INTERACTION_DISTANCE: 1.5,
    AUTO_ROTATION_ENABLED: true,
    AUTO_ROTATION_SPEED: 0.0003,
    MOUSE_ROTATION_ENABLED: true,
    CLICK_ANIMATION_DURATION: 1500,
};

export const SKILLS = [
    { icon: "/assets/sprites/html.svg", name: "HTML" },
    { icon: "/assets/sprites/css.svg", name: "CSS" },
    { icon: "/assets/sprites/js.svg", name: "JavaScript" },
    { icon: "/assets/sprites/react.svg", name: "React" },
    { icon: "/assets/sprites/ts.svg", name: "TypeScript" },
    { icon: "/assets/sprites/git.svg", name: "Git" },
    { icon: "/assets/sprites/node.svg", name: "Node" },
    { icon: "/assets/sprites/redux.svg", name: "Redux" },
    { icon: "/assets/sprites/sass.svg", name: "Sass" },
    { icon: "/assets/sprites/webpack.svg", name: "Webpack" },
    { icon: "/assets/sprites/nextjs.svg", name: "Next.js" },
    { icon: "/assets/sprites/jest.svg", name: "Jest" },
    { icon: "/assets/sprites/vite.svg", name: "Vite" },
];

export function generateGoldenSphereCube(count: number): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r * CONFIG.RADIUS;
        const yPos = y * CONFIG.RADIUS;
        const z = Math.sin(phi) * r * CONFIG.RADIUS;

        positions.push(new THREE.Vector3(x, yPos, z));
    }

    return positions;
}

export function createSkillPoints(positions: THREE.Vector3[]): SkillPoint[] {
    return positions.map((position, i) => ({
        position,
        name: SKILLS[i % SKILLS.length].name,
        svgUrl: SKILLS[i % SKILLS.length].icon,
    }));
}

export function findNearestNeighbors(
    points: SkillPoint[],
    count: number = CONFIG.CONNECT_NEIGHBORS
): number[][] {
    return points.map((point, i) => {
        return points
            .map((other, j) => ({
                idx: j,
                dist: point.position.distanceTo(other.position),
            }))
            .filter((v) => v.idx !== i)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, count)
            .map((v) => v.idx);
    });
}

export async function createSvgTexture(svgUrl: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, 256, 256);
            resolve(canvas);
        };
        img.onerror = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            resolve(canvas);
        };
        img.src = svgUrl;
    });
}
