import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import { Montserrat } from "next/font/google";
import "@/styles/index.scss";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import PageTransitionProvider from "@/providers/transition/PageTransitionProvider";
import LenisProvider from "@/providers/lenis/LenisProvider";
import type { ReactNode } from "react";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

type LocaleParams = { locale: string };

type LocaleLayoutProps = {
    children: ReactNode;
    params: LocaleParams | Promise<LocaleParams>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body className={montserrat.className}>
                <NextIntlClientProvider locale={locale}>
                    <ThemeProvider>
                        <PageTransitionProvider>
                            <LenisProvider />
                            <div className="container">
                                <Header />
                                <main>{children}</main>
                            </div>
                        </PageTransitionProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
