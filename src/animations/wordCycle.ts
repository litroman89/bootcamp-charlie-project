import { gsap } from './gsap';
import { normalizeTargets, type Targets } from './utils';

export interface CycleWordsOptions {
    duration?: number;
    delay?: number;
    yOffset?: number | string;
}

export function cycleWords(targets: Targets, words: string[], options?: CycleWordsOptions) {
    if (typeof window === 'undefined') return;

    const elements = normalizeTargets(targets);
    if (!elements.length) return;

    const { duration = 0.2, delay = 1, yOffset = 20 } = options || {};

    elements.forEach((el) => {
        const tl = gsap.timeline({ repeat: -1 });

        words.forEach((_, i) => {
            const nextIndex = (i + 1) % words.length;
            const nextWord = words[nextIndex];

            // 1. Wait, then animate out (upwards)
            tl.to(el, { y: -yOffset, opacity: 0, duration, delay, ease: 'power2.inOut' })
                // 2. Swap text and reset position to bottom
                .set(el, { textContent: nextWord, y: yOffset })
                // 3. Animate in (to normal position)
                .to(el, { y: 0, opacity: 1, duration, ease: 'back.out(3)' });
        });
    });
}
