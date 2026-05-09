"use client";

import Image from "next/image";
import { Link } from "@/shared/i18n/navigation";
import { usePageTransition } from "@/app/providers/transition";
import styles from "./PostDetail.module.scss";
import ArrowLeftIcon from "./assets/arrow-left.svg";

interface PostBackLinkProps {
    label: string;
}

export const PostBackLink = ({ label }: PostBackLinkProps) => {
    const { startTransition } = usePageTransition();

    return (
        <Link
            href="/posts"
            className={styles["post-detail__back-link"]}
            onClick={() => startTransition("/posts")}
        >
            <Image
                className={styles["post-detail__back-icon"]}
                src={ArrowLeftIcon}
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
            />
            {label}
        </Link>
    );
};
