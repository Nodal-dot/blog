import { Montserrat } from "next/font/google";
import Script from "next/script";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import "@/shared/styles/index.scss";

const montserrat = Montserrat({
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-montserrat",
    display: "swap",
});
const themeInitScript = `(() => {
    try {
        const stored = localStorage.getItem("theme");
        const systemTheme = typeof window.matchMedia === "function"
            && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        const theme = stored === "light" || stored === "dark" ? stored : systemTheme;
        document.documentElement.setAttribute("data-theme", theme);
    } catch {}
})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale();

    return (
        <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
            <body className={`${montserrat.variable} ${montserrat.className}`}>
                <Script id="theme-init" strategy="beforeInteractive">
                    {themeInitScript}
                </Script>
                {children}
            </body>
        </html>
    );
}
