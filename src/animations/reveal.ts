import { gsap, ScrollTrigger } from './gsap';
import { normalizeTargets, type Targets } from '@/utils/normalizeTargets';

export interface RevealOptions {
    distance?: number | string;
    duration?: number;
    ease?: string;
    stagger?: number;
    start?: string;
    end?: string;
    once?: boolean;
    delay?: number;
}

const defaultOptions: Required<RevealOptions> = {
    distance: 60,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.1,
    start: 'top 85%',
    end: 'bottom 10%',
    once: false,
    delay: 0,
};

const initializedElements = new WeakSet<Element>();

function createScrollReveal(
    targets: Targets,
    axis: 'x' | 'y',
    offset: number | string,
    options?: RevealOptions,
) {
    if (typeof window === 'undefined') {
        return { refresh: () => { }, destroy: () => { } };
    }

    const opts = { ...defaultOptions, ...options };
    const allElements = normalizeTargets(targets);

    // Filter elements to avoid duplicate initializations
    const elements = allElements.filter(el => {
        if (initializedElements.has(el)) return false;
        initializedElements.add(el);
        return true;
    });

    if (elements.length === 0) {
        return {
            refresh: () => ScrollTrigger.refresh(),
            destroy: () => { },
        };
    }

    // Set initial state
    const initialVars: gsap.TweenVars = {
        autoAlpha: 0,
        [axis]: offset,
    };

    // Set initial state to prevent initial flash
    gsap.set(elements, initialVars);

    const animateIn = (batch: Element[]) => {
        const toVars: gsap.TweenVars = {
            autoAlpha: 1,
            stagger: opts.stagger,
            duration: opts.duration,
            ease: opts.ease,
            overwrite: 'auto',
            [axis]: 0,
            delay: opts.delay,
        };
        gsap.to(batch, toVars);
    };

    const animateOut = (batch: Element[]) => {
        gsap.to(batch, {
            ...initialVars,
            duration: opts.duration,
            ease: opts.ease,
            overwrite: true, // Важно: прерываем предыдущую анимацию полностью
        });
    };

    // Create batch
    const triggers = ScrollTrigger.batch(elements, {
        start: opts.start,
        end: opts.end,
        once: opts.once,
        onEnter: animateIn,
        onEnterBack: animateIn,
        onLeave: animateOut,
        onLeaveBack: animateOut,
    });

    return {
        refresh: () => {
            ScrollTrigger.refresh();
        },
        destroy: () => {
            elements.forEach(el => {
                initializedElements.delete(el);
            });
            if (triggers) {
                triggers.forEach(t => {
                    t.kill();
                });
            }
            gsap.set(elements, { clearProps: 'all' });
        },
    };
}

export function revealFromLeft(targets: Targets, options?: RevealOptions) {
    const dist = options?.distance ?? defaultOptions.distance;
    const offset = typeof dist === 'number' ? -dist : `-${dist}`;
    return createScrollReveal(targets, 'x', offset, options);
}

export function revealFromRight(targets: Targets, options?: RevealOptions) {
    const dist = options?.distance ?? defaultOptions.distance;
    const offset = typeof dist === 'number' ? dist : `${dist}`;
    return createScrollReveal(targets, 'x', offset, options);
}

export function revealFromBottom(targets: Targets, options?: RevealOptions) {
    const offset = options?.distance ?? defaultOptions.distance;
    return createScrollReveal(targets, 'y', offset, options);
}

export function revealFromTop(targets: Targets, options?: RevealOptions) {
    const offset = options?.distance ?? defaultOptions.distance;
    return createScrollReveal(targets, 'y', `-${offset}`, options);
}