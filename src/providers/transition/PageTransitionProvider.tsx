'use client';

import React, {
  createContext,
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import styles from './PageTransition.module.scss';
import { useRouter } from '@/i18n/navigation';

interface PageTransitionContextProps {
  startTransition: (to: string, locale?: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextProps>({
  startTransition: () => {},
  isTransitioning: false,
});

export const PageTransitionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Для хранения целевого URL и локали
  const targetUrlRef = useRef<string | null>(null);
  const targetLocaleRef = useRef<string | undefined>(undefined);

  // Чтобы блокировать повторные переходы во время анимации
  const transitionLockedRef = useRef(false);

  // Ссылка на элемент анимации загрузки
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Запуск перехода (с анимацией)
  const startTransition = useCallback((to: string, locale?: string) => {
    if (transitionLockedRef.current) return;

    transitionLockedRef.current = true;
    setIsTransitioning(true);
    targetUrlRef.current = to;
    targetLocaleRef.current = locale;
  }, []);

  // Обработчик окончания CSS-перехода анимации
  const handleTransitionEnd = useCallback(() => {
    const to = targetUrlRef.current;
    const locale = targetLocaleRef.current;

    if (!to) return;

    if (locale) {
      router.push(to, { locale });
    } else {
      router.push(to);
    }

    // Сбрасываем состояние после небольшой задержки, чтобы анимация ушла
    setTimeout(() => {
      setIsTransitioning(false);
      transitionLockedRef.current = false;
      targetUrlRef.current = null;
      targetLocaleRef.current = undefined;
    }, 600); // Время совпадает с CSS анимацией
  }, [router]);

  // Слушатель события окончания CSS анимации
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'transform' && isTransitioning) {
        handleTransitionEnd();
      }
    };

    loader.addEventListener('transitionend', onEnd);
    return () => {
      loader.removeEventListener('transitionend', onEnd);
    };
  }, [handleTransitionEnd, isTransitioning]);

  return (
    <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
      <div className={styles.wrapper}>
        {/* Элемент для анимации перехода */}
        <div
          ref={loaderRef}
          className={`${styles.loader} ${isTransitioning ? styles.active : ''}`}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => useContext(PageTransitionContext);

export default PageTransitionProvider;
