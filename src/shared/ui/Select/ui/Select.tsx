"use client";

import React, { useRef, useEffect, useCallback, type FC } from "react";
import styles from "./Select.module.scss";
import { Icon } from "@/shared/ui/Icon";
import { classNames } from "@/shared/lib/classNames";
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
        const selectRef = useRef<HTMLDivElement>(null);
        const selectTriggerRef = useRef<HTMLButtonElement>(null);
        const listRef = useRef<HTMLUListElement>(null);
        const selectId = React.useId();
        const labelId = `${selectId}-label`;
        const listboxId = `${selectId}-listbox`;

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
            updateSelectMinWidth();
        }, []);

        const handleSelect = useCallback(
            (selectedValue: string, event: React.MouseEvent<HTMLButtonElement>) => {
                onChange(selectedValue);

                event.currentTarget.blur();
                selectTriggerRef.current?.blur();
            },
            [onChange]
        );

        const selectedLabel =
            options.find((opt) => opt.value === value)?.label || placeholder || t("placeholder");

        return (
            <div className={styles["select"]}>
                {label && (
                    <span id={labelId} className={styles["select__label"]}>
                        {label}
                    </span>
                )}
                <div ref={selectRef} className={styles["select__container"]}>
                    <button
                        type="button"
                        ref={selectTriggerRef}
                        aria-haspopup="listbox"
                        aria-controls={listboxId}
                        aria-labelledby={label ? `${labelId} ${listboxId}` : undefined}
                        aria-label={ariaLabel || label}
                        className={styles["select__trigger"]}
                    >
                        <span className={styles["select__value"]}>{selectedLabel}</span>
                        <Icon name="chevron-down" size={20} className={styles["select__icon"]} />
                    </button>

                    <ul
                        id={listboxId}
                        role="listbox"
                        aria-label={!label ? ariaLabel || selectedLabel : undefined}
                        aria-labelledby={label ? labelId : undefined}
                        className={styles["select__options"]}
                        ref={listRef}
                    >
                        {options.map((option) => (
                            <li role="none" key={option.value}>
                                <button
                                    type="button"
                                    onClick={(e) => handleSelect(option.value, e)}
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
