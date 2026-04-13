import React, { type FC, type InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
}

export const Input: FC<InputProps> = ({ icon, label, className, ...props }) => {
    return (
        <div className={styles["input"]}>
            {label && <span className={styles["input__label"]}>{label}</span>}
            <div className={`${styles["input__wrapper"]}`}>
                {icon && <div className={styles["input__icon"]}>{icon}</div>}
                <input {...props} className={`${styles["input__field"]} ${className || ""}`} />
            </div>
        </div>
    );
};
