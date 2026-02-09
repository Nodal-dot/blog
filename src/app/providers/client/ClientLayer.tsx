"use client";

import type { FC, ReactNode } from "react";
import { ThemeProvider } from "../theme/ThemeProvider";
import { PageTransitionProvider } from "../transition/ui/PageTransitionProvider";

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
