import type { FC } from "react";
import MainHero from "./MainHero";
import MainPosts from "./MainPosts";

export const MainPage: FC = () => {
    return (
        <>
            <MainHero />
            <MainPosts />
        </>
    );
};
