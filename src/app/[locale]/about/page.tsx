import type { FC } from "react";
import AboutHero from "@/widgets/AboutHero";
import AboutPath from "@/widgets/AboutPath";
import AboutSkill from "@/widgets/AboutSkill";

const AboutPage: FC = () => (
    <>
        <AboutHero />
        <AboutPath />
        <AboutSkill />
    </>
);

export default AboutPage;
