import AboutHero from "@/sections/about/AboutHero";
import AboutPath from "@/sections/about/AboutPath";
import AboutSkill from "@/sections/about/AboutSkill";
import type { Metadata } from "next";
import type { FC } from "react";
import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "../metadata";
import type { Locale } from "@/shared/i18n/types";

interface AboutPageProps {
    params: Promise<{ locale: Locale }>;
}

const AboutPage: FC<AboutPageProps> = () => (
    <>
        <AboutHero />
        <AboutPath />
        <AboutSkill />
    </>
);

export default AboutPage;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations("Metadata.About");
    return createPageMetadata({
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
        path: `/${locale}/about`,
        locale,
    });
}
