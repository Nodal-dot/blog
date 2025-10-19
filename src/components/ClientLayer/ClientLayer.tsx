"use client";

import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import { PageTransitionProvider } from "@/providers/transition/PageTransitionProvider";
import type { ReactNode } from "react";

export default function ClientLayer({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <PageTransitionProvider>{children}</PageTransitionProvider>
        </ThemeProvider>
    );
}
