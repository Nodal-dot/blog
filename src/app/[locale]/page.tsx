import { createPageMetadata } from "./metadata";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import { getTranslations } from "next-intl/server";
import MainPage from "@/pages/main";

const MainPageRouter = () => {
    return <MainPage />;
};

export default MainPageRouter;

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
