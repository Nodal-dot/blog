import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import { Montserrat } from 'next/font/google';
import '@/styles/index.scss';
import { ThemeProvider } from '@/providers/theme/ThemeProvider';
import PageTransitionProvider from '@/providers/transition/PageTransitionProvider';

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={montserrat.className}>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            <PageTransitionProvider>
              <Header />
              {children}
            </PageTransitionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
