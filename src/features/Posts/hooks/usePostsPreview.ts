import { useState } from "react";

interface ActivePost {
    id?: string;
    videoUrl?: string;
    visible: boolean;
}

export const usePostsPreview = () => {
    const [active, setActive] = useState<ActivePost>({
        visible: false,
    });

    const openPreview = (id: string, videoUrl?: string) => {
        setActive({ id, videoUrl, visible: true });
    };

    const closePreview = () => {
        setActive({ visible: false });
    };

    return {
        active,
        openPreview,
        closePreview,
    };
};
