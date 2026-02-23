import type { FC } from "react";
import { createPageMetadata } from "./metadata";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/types";
import MainHero from "@/widgets/MainHero";
import MainProject from "@/widgets/MainProject";
import { getTranslations } from "next-intl/server";

interface HomePageProps {
    params: Promise<{
        locale: Locale;
    }>;
}

const HomePage: FC<HomePageProps> = async (props) => {
    const { params } = props;
    const { locale } = await params;

    return (
        <>
            <MainHero />
            <MainProject locale={locale} />
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
    const t = await getTranslations("Metadata");
    return createPageMetadata({
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
        path: `/${locale}`,
        locale,
    });
}
