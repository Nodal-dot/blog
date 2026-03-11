"use client";

import type { FC, ReactNode } from "react";
import { ThemeProvider } from "../theme";
import { PageTransitionProvider } from "../transition";
import { ResponsiveProvider } from "../responsive";

interface ClientLayerProps {
    children: ReactNode;
}

const ClientLayer: FC<ClientLayerProps> = (props) => {
    const { children } = props;
    return (
        <ThemeProvider>
            <PageTransitionProvider>
                <ResponsiveProvider>{children}</ResponsiveProvider>
            </PageTransitionProvider>
        </ThemeProvider>
    );
};
export default ClientLayer;
