import AboutHero from "@/sections/about/ui/AboutHero";
import AboutPath from "@/sections/about/ui/AboutPath";
import AboutSkill from "@/sections/about/ui/AboutSkill";
import type { FC } from "react";

const AboutPage: FC = () => (
    <>
        <AboutHero />
        <AboutPath />
        <AboutSkill />
    </>
);

export default AboutPage;
