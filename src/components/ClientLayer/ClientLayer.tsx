"use client";

import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import { PageTransitionProvider } from "@/providers/transition/PageTransitionProvider";
import type { FC, ReactNode } from "react";

interface ClientLayerProps {
    children: ReactNode;
}

const ClientLayer: FC<ClientLayerProps> = (props) => {
    const { children } = props;
    return (
        <ThemeProvider>
            <PageTransitionProvider>{children}</PageTransitionProvider>
        </ThemeProvider>
    );
};
export default ClientLayer;
