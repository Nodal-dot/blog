"use client";

import { MEDIA } from "@/shared/config/breakpoints";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type Device = "mobile" | "tablet" | "desktop";

interface ResponsiveState {
    device: Device;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

const ResponsiveContext = createContext<ResponsiveState | null>(null);

function getDevice(): Device {
    if (typeof window === "undefined") return "desktop";

    if (window.matchMedia(MEDIA.mobile).matches) return "mobile";
    if (window.matchMedia(MEDIA.tablet).matches) return "tablet";

    return "desktop";
}

export function ResponsiveProvider({ children }: { children: ReactNode }) {
    const [device, setDevice] = useState<Device>(() => getDevice());

    useEffect(() => {
        const mobileQuery = window.matchMedia(MEDIA.mobile);
        const tabletQuery = window.matchMedia(MEDIA.tablet);
        const desktopQuery = window.matchMedia(MEDIA.desktop);

        const updateDevice = () => {
            if (mobileQuery.matches) return setDevice("mobile");
            if (tabletQuery.matches) return setDevice("tablet");
            setDevice("desktop");
        };

        mobileQuery.addEventListener("change", updateDevice);
        tabletQuery.addEventListener("change", updateDevice);
        desktopQuery.addEventListener("change", updateDevice);

        return () => {
            mobileQuery.removeEventListener("change", updateDevice);
            tabletQuery.removeEventListener("change", updateDevice);
            desktopQuery.removeEventListener("change", updateDevice);
        };
    }, []);

    const value = useMemo<ResponsiveState>(
        () => ({
            device,
            isMobile: device === "mobile",
            isTablet: device === "tablet",
            isDesktop: device === "desktop",
        }),
        [device]
    );

    return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
}

export function useResponsive() {
    const context = useContext(ResponsiveContext);

    if (!context) {
        throw new Error("useResponsive must be used inside ResponsiveProvider");
    }

    return context;
}
