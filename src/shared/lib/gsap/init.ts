import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isGsapInitialized = false;

export const initGsap = () => {
    if (isGsapInitialized) return;

    gsap.registerPlugin(useGSAP, ScrollTrigger);
    isGsapInitialized = true;
};
