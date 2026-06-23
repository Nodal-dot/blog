export const BASE_SEO = {
    en: {
        siteName: "Nodal-dot — Frontend developer",
        locale: "en_US",
        url: "https://nodaldot.space",
        defaultImage: "/posts/images/1.jpg",
    },
    ru: {
        siteName: "Nodal-dot — Разработчик интерфейсов",
        locale: "ru_RU",
        url: "https://nodaldot.space",
        defaultImage: "/posts/images/1.jpg",
    },
} as const;

export function resolveAbsoluteAssetUrl(baseUrl: string, assetPath: string) {
    if (assetPath.startsWith("http")) return assetPath;

    const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    return `${baseUrl}${normalizedPath}`;
}
