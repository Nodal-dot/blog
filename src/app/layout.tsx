import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import "@/shared/styles/index.scss";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={montserrat.className}>{children}</body>
        </html>
    );
}
