"use client";

import { MEDIA } from "@/shared/config/breakpoints";
import React, {
    createContext,
    use,
    useMemo,
    useSyncExternalStore,
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

function subscribe(onStoreChange: () => void) {
    if (typeof window === "undefined") {
        return () => {};
    }

    const mobileQuery = window.matchMedia(MEDIA.mobile);
    const tabletQuery = window.matchMedia(MEDIA.tablet);
    const desktopQuery = window.matchMedia(MEDIA.desktop);

    mobileQuery.addEventListener("change", onStoreChange);
    tabletQuery.addEventListener("change", onStoreChange);
    desktopQuery.addEventListener("change", onStoreChange);

    return () => {
        mobileQuery.removeEventListener("change", onStoreChange);
        tabletQuery.removeEventListener("change", onStoreChange);
        desktopQuery.removeEventListener("change", onStoreChange);
    };
}

function getDevice(): Device {
    if (typeof window === "undefined") return "desktop";

    if (window.matchMedia(MEDIA.mobile).matches) return "mobile";
    if (window.matchMedia(MEDIA.tablet).matches) return "tablet";

    return "desktop";
}

export function ResponsiveProvider({ children }: { children: ReactNode }) {
    const device = useSyncExternalStore<Device>(subscribe, getDevice, () => "desktop");

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
    const context = use(ResponsiveContext);

    if (!context) {
        throw new Error("useResponsive must be used inside ResponsiveProvider");
    }

    return context;
}
