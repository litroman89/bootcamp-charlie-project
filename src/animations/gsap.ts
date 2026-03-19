import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Safely register plugin for SSR (like Astro)
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
