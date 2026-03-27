import { createPageMetadata } from "./metadata";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import { getTranslations } from "next-intl/server";
import { getPosts } from "@/entities/post/api/getPosts";
import type { FC } from "react";
import MainHero from "@/sections/main/ui/MainHero";
import MainPosts from "@/sections/main/ui/MainPosts";

interface MainPageProps {
    params: Promise<{ locale: Locale }>;
}

const MainPage: FC<MainPageProps> = async ({ params }) => {
    const { locale } = await params;

    const posts = await getPosts(locale);

    return (
        <>
            <MainHero />
            <MainPosts posts={posts} />
        </>
    );
};

export default MainPage;

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
