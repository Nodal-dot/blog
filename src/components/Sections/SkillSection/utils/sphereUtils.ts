export type Point3D = {
    x0: number;
    y0: number;
    z0: number;
    x?: number;
    y?: number;
    z?: number;
    px?: number;
    py?: number;
    scale?: number;
    icon?: HTMLImageElement;
    name: string;
    neighbors?: number[];
};

export const CONFIG = {
    RADIUS: 200,
    ICON_SIZE: 32,
    SPEED: 0.002,
    FOV: 400,
    POINT_COUNT: 40,
    CONNECT_NEIGHBORS: 5,
    ARC_STEPS: 20,
};

export const SKILLS = [
    { icon: "/assets/sprites/html.svg", name: "HTML" },
    { icon: "/assets/sprites/css.svg", name: "CSS" },
    { icon: "/assets/sprites/js.svg", name: "JS" },
    { icon: "/assets/sprites/react.svg", name: "React" },
    { icon: "/assets/sprites/ts.svg", name: "TS" },
    { icon: "/assets/sprites/git.svg", name: "Git" },
    { icon: "/assets/sprites/node.svg", name: "Node" },
];

export function createSphere(count: number, images: HTMLImageElement[]) {
    const pts: Point3D[] = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        pts.push({
            x0: Math.cos(phi) * r * CONFIG.RADIUS,
            y0: y * CONFIG.RADIUS,
            z0: Math.sin(phi) * r * CONFIG.RADIUS,
            icon: images[i % images.length],
            name: SKILLS[i % SKILLS.length].name,
        });
    }

    return pts;
}

export function fixNeighbors(points: Point3D[]) {
    points.forEach((p, i) => {
        const neighbors = points
            .map((q, j) => ({ idx: j, d: Math.hypot(p.x0 - q.x0, p.y0 - q.y0, p.z0 - q.z0) }))
            .filter((v) => v.idx !== i)
            .sort((a, b) => a.d - b.d)
            .slice(0, CONFIG.CONNECT_NEIGHBORS)
            .map((v) => v.idx);
        p.neighbors = neighbors;
    });
}

export function project(p: Point3D) {
    const scale = CONFIG.FOV / (CONFIG.FOV + p.z!);
    if (scale <= 0) return null;
    return { x: p.x! * scale, y: p.y! * scale, scale };
}

export function slerp(a: Point3D, b: Point3D, t = 0.5): { x: number; y: number; z: number } {
    const mag = (p: Point3D) => Math.sqrt(p.x! ** 2 + p.y! ** 2 + p.z! ** 2);
    const norm = (p: Point3D) => {
        const m = mag(p);
        return { x: p.x! / m, y: p.y! / m, z: p.z! / m };
    };

    const v1 = norm(a);
    const v2 = norm(b);
    const dot = Math.min(Math.max(v1.x * v2.x + v1.y * v2.y + v1.z * v2.z, -1), 1);
    const theta = Math.acos(dot);
    if (theta < 0.0001) return { x: a.x!, y: a.y!, z: a.z! };

    const sinT = Math.sin(theta);
    const w1 = Math.sin((1 - t) * theta) / sinT;
    const w2 = Math.sin(t * theta) / sinT;

    return {
        x: (v1.x * w1 + v2.x * w2) * CONFIG.RADIUS,
        y: (v1.y * w1 + v2.y * w2) * CONFIG.RADIUS,
        z: (v1.z * w1 + v2.z * w2) * CONFIG.RADIUS,
    };
}
