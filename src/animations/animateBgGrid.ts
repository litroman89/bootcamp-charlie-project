import { gsap } from './gsap';
import { type Targets } from '@/utils/normalizeTargets';

// Находим градиент

export function animateBgGrid(targets: Targets) {
    if (typeof window === 'undefined') return;

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });

    tl.set(targets, { attr: { cx: '85%', cy: '15%' } })

        // 1. К левому центру
        .to(targets, { attr: { cx: '15%', cy: '45%' }, duration: 3 })
        .to({}, { duration: 1 }) // Ожидание

        // 2. К правому низу
        .to(targets, { attr: { cx: '100%', cy: '85%' }, duration: 3 })
        .to({}, { duration: 1 }) // Ожидание

        // 3. Возврат к левому центру
        .to(targets, { attr: { cx: '15%', cy: '45%' }, duration: 3 })
        .to({}, { duration: 1 }) // Ожидание

        // 4. Возврат к правому верху
        .to(targets, { attr: { cx: '85%', cy: '15%' }, duration: 3 })
        .to({}, { duration: 1 });
}

export function initBgGridAnimation() {
    const elements = document.querySelectorAll<HTMLElement>(
        '.animated-grid[data-gradient-id]',
    );

    if (elements.length === 0) return;

    elements.forEach((el: HTMLElement) => {
        const gradientId = el.dataset.gradientId;
        if (gradientId) animateBgGrid(`#${gradientId}`);
    });
}