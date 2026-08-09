import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import "@/shared/styles/index.scss";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });
const themeInitScript = `(() => {
    const stored = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = stored === "light" || stored === "dark" ? stored : systemTheme;
    document.documentElement.setAttribute("data-theme", theme);
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={montserrat.className}>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
                {children}
            </body>
        </html>
    );
}
