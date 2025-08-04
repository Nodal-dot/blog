'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import styles from './Header.module.scss';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '@/providers/theme/ThemeProvider';
import { usePageTransition } from '@/providers/transition/PageTransitionProvider';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const { startTransition } = usePageTransition();

  // Закрываем меню выбора языка по клику вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обработка смены языка с анимацией перехода
  const handleLangChange = (newLocale: string) => {
    if (newLocale !== locale) {
      startTransition(pathname, newLocale);
    }
    setLangOpen(false);
  };

  // Обработка навигации по ссылкам с анимацией перехода
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href !== pathname) {
      startTransition(href, locale);
    }
  };

  const navLinks = [
    { href: '/', label: t('Nav.home') },
    { href: '/about', label: t('Nav.about') },
    { href: '/blog', label: t('Nav.blog') },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles['header__nav']} aria-label="Main navigation">
        <ul className={styles['header__nav-list']}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleNavigation(e, href)}
                aria-current={pathname === href ? 'page' : undefined}
                className={`${styles['header__link']} ${
                  pathname === href ? styles['header__link--active'] : ''
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles['header__socials']}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={styles['header__github']}
        >
          <Image
            src={
              theme === 'dark'
                ? '/assets/sprites/github-mark-white.svg'
                : '/assets/sprites/github-mark.svg'
            }
            alt="GitHub"
            width={20}
            height={20}
          />
        </a>
      </div>

      <div className={styles['header__settings']}>
        <button onClick={toggleTheme} aria-label={t('Theme.toggle')}>
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>

        <div className={styles['header__lang']} ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            aria-label="Change language"
            className={styles['header__lang-button']}
          >
            <Globe size={24} />
          </button>

          <ul
            role="listbox"
            className={`${styles['header__lang-options']} ${
              langOpen ? styles.open : ''
            }`}
          >
            <li role="option">
              <button
                onClick={() => handleLangChange('en')}
                aria-selected={locale === 'en'}
                className={locale === 'en' ? styles.selected : ''}
              >
                EN
              </button>
            </li>
            <li role="option">
              <button
                onClick={() => handleLangChange('ru')}
                aria-selected={locale === 'ru'}
                className={locale === 'ru' ? styles.selected : ''}
              >
                RU
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
