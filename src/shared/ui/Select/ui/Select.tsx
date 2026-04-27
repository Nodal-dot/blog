"use client";

import React, { useState, useRef, useEffect, useCallback, type FC } from "react";
import styles from "./Select.module.scss";
import { ChevronDown } from "lucide-react";
import { classNames } from "@/shared/lib/classNames";
import { useResponsive } from "@/app/providers/responsive";
import { useTranslations } from "next-intl";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
}

export const Select: FC<SelectProps> = React.memo(
    ({ value, onChange, options, label, placeholder, ariaLabel }) => {
        const t = useTranslations("Select");
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef<HTMLDivElement>(null);
        const selectTriggerRef = useRef<HTMLButtonElement>(null);
        const listRef = useRef<HTMLUListElement>(null);
        const closeTimeout = useRef<NodeJS.Timeout | null>(null);

        const { isDesktop } = useResponsive();
        const isDesktopRef = useRef(isDesktop);
        useEffect(() => {
            isDesktopRef.current = isDesktop;
        }, [isDesktop]);

        const updateSelectMinWidth = () => {
            if (listRef.current && selectRef.current && selectTriggerRef.current) {
                const optionButtons = Array.from(listRef.current.querySelectorAll("button"));

                let maxWidth = 0;
                optionButtons.forEach((btn) => {
                    const width = btn.getBoundingClientRect().width;
                    if (width > maxWidth) maxWidth = width;
                });
                const computedStyle = window.getComputedStyle(selectTriggerRef.current);
                const paddingLeft = parseFloat(computedStyle.paddingLeft);
                const gap = parseFloat(computedStyle.gap);
                const paddingRight = parseFloat(computedStyle.paddingRight);
                const totalPadding = paddingLeft + paddingRight;
                selectRef.current.style.width = `${maxWidth + totalPadding + gap}px`;
            }
        };
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);

            updateSelectMinWidth();
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);
        const handleMouseEnter = useCallback(() => {
            if (!isDesktopRef.current) return;
            if (closeTimeout.current) {
                clearTimeout(closeTimeout.current);
                closeTimeout.current = null;
            }
            setIsOpen(true);
        }, []);

        const handleMouseLeave = useCallback(() => {
            if (!isDesktopRef.current) return;
            closeTimeout.current = setTimeout(() => {
                setIsOpen(false);
            }, 150);
        }, []);

        const handleToggle = useCallback(() => {
            setIsOpen((prev) => !prev);
        }, []);

        const handleSelect = useCallback(
            (selectedValue: string) => {
                onChange(selectedValue);
                setIsOpen(false);
            },
            [onChange]
        );

        const selectedLabel =
            options.find((opt) => opt.value === value)?.label || placeholder || t("placeholder");

        return (
            <div className={styles.select}>
                {label && <span className={styles["select__label"]}>{label}</span>}
                <div
                    ref={selectRef}
                    className={styles["select__container"]}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button
                        type="button"
                        ref={selectTriggerRef}
                        onClick={handleToggle}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-label={ariaLabel || label}
                        className={styles["select__trigger"]}
                    >
                        <span className={styles["select__value"]}>{selectedLabel}</span>
                        <ChevronDown
                            size={20}
                            className={classNames(styles["select__icon"], {
                                [styles["select__icon-opened"]]: isOpen,
                            })}
                        />
                    </button>

                    <ul
                        role="listbox"
                        className={classNames(styles["select__options"], {
                            [styles["select__options-opened"]]: isOpen,
                        })}
                        ref={listRef}
                    >
                        {options.map((option) => (
                            <li role="none" key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    role="option"
                                    aria-selected={value === option.value}
                                    className={classNames(
                                        styles["select__option"],
                                        value === option.value && styles["select__option-selected"]
                                    )}
                                    disabled={value === option.value}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
);

Select.displayName = "Select";
