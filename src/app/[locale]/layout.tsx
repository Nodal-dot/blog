import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import ClientLayer from "@/components/ClientLayer/ClientLayer";
import type { Viewport } from "next";
import "@/styles/index.scss";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
    themeColor: "#ffffff",
};

type LocaleParams = { locale: string };
type LocaleLayoutProps = {
    children: ReactNode;
    params: LocaleParams | Promise<LocaleParams>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) notFound();

    return (
        <html lang={locale}>
            <head>
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/favicon-144x144.png" />
                <link rel="manifest" href={`/api/manifest?locale=${locale}`} />
            </head>
            <body className={montserrat.className}>
                <NextIntlClientProvider locale={locale}>
                    <ClientLayer>
                        <div className="container">
                            <Header />
                            <main>{children}</main>
                            <Footer />
                        </div>
                    </ClientLayer>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
