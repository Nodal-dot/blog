import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
    sassOptions: {
        additionalData: `@use "@/shared/styles/utils/index" as *;`,
    },
};

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");

export default withBundleAnalyzer(withNextIntl(nextConfig));
