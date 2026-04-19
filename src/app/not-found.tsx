import "@/shared/styles/index.scss";
import { NextIntlClientProvider } from "next-intl";
import NotFound from "@/sections/not-found";
import enMessages from "@/shared/i18n/locales/en.json";

export default function NotFoundRouter() {
    return (
        <NextIntlClientProvider locale="en" messages={enMessages}>
            <NotFound />
        </NextIntlClientProvider>
    );
}
