import MainSection from "@/components/Sections/MainSection";
import ProjectSection from "@/components/Sections/ProjectSection";
import type { FC } from "react";
import { createPageMetadata } from "./metadata";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/types";

interface IHomePage {
    params: Promise<{
        locale: Locale;
    }>;
}

const HomePage: FC<IHomePage> = async (props) => {
    const { params } = props;
    const { locale } = await params;

    return (
        <>
            <MainSection />
            <ProjectSection locale={locale} />
        </>
    );
};

export default HomePage;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;

    return createPageMetadata({
        title:
            locale === "ru" ? "Фронтенд разработчик — Nodal-dot" : "Frontend Developer — Nodal-dot",
        description:
            locale === "ru"
                ? "Портфолио фронтенд разработчика. React, Next.js, TypeScript."
                : "Frontend developer portfolio. React, Next.js, TypeScript.",
        keywords:
            locale === "ru"
                ? ["Фронтенд разработчик", "React", "Next.js", "TypeScript", "Портфолио"]
                : ["Frontend Developer", "React", "Next.js", "TypeScript", "Portfolio"],
        path: `/${locale}`,
        locale,
    });
}
