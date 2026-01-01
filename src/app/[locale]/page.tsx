import "@/styles/index.scss";
import MainSection from "@/components/Sections/MainSection";
import ProjectSection from "@/components/Sections/ProjectSection";
import SkillSection from "@/components/Sections/SkillSection";
import type { FC } from "react";

interface IHomePage {
    params: { locale: string };
}

const HomePage: FC<IHomePage> = async (props) => {
    const { params } = props;
    const { locale } = await params;

    return (
        <>
            <MainSection />
            <ProjectSection locale={locale} />
            <SkillSection />
        </>
    );
};

export default HomePage;
