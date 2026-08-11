import type { TocItem } from "../../model/types";
import styles from "./PostToc.module.scss";

interface PostTocProps {
    toc: TocItem[];
    label: string;
}

export const PostToc: React.FC<PostTocProps> = ({ toc, label }) => {
    return (
        <aside id="toc" className={styles["post-toc"]}>
            <h4 className={styles["post-toc__title"]}>{label}</h4>

            <ul className={styles["post-toc__list"]}>
                {toc.map((item) => (
                    <PostTocItem key={item.id} item={item} />
                ))}
            </ul>
        </aside>
    );
};

const PostTocItem: React.FC<{ item: TocItem }> = ({ item }) => {
    return (
        <li className={styles["post-toc__item"]}>
            <a className={styles["post-toc__link"]} href={`#${item.id}`}>
                {item.title}
            </a>

            {item.children.length > 0 && (
                <ul className={styles["post-toc__list"]}>
                    {item.children.map((child) => (
                        <PostTocItem key={child.id} item={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};
