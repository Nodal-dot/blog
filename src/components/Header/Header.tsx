'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import styles from './Header.module.scss';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newLocale = e.target.value;
  router.push(pathname, { locale: newLocale });
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
              <Link
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={pathname === href ? styles['header__link--active'] : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles['header__socials']} aria-label="Social links">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">{t('Social.github')}</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">{t('Social.twitter')}</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">{t('Social.linkedin')}</a>
      </div>

      <div className={styles['header__theme-toggle']}>
        <button onClick={toggleTheme} aria-label={t('Theme.toggle')}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className={styles['header__lang-switch']}>
        <label htmlFor="lang-select" className="sr-only">Switch language</label>
        <select id="lang-select" value={locale} onChange={handleLangChange}>
          <option value="en">EN</option>
          <option value="ru">RU</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
