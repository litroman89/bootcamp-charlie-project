/** @vitest-environment node */

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Document as HappyDocument, Window } from 'happy-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import Hero from './Hero.astro';

vi.mock('@/assets/icons/insta.svg', () => import('../test/stubs/SvgIconStub.astro'));
vi.mock('@/assets/icons/linkedIn.svg', () => import('../test/stubs/SvgIconStub.astro'));
vi.mock('@/assets/icons/telegram.svg', () => import('../test/stubs/SvgIconStub.astro'));
vi.mock('@/assets/icons/snake-icon-white.svg', () =>
    import('../test/stubs/SvgIconStub.astro'),
);

describe('Hero.astro', () => {
    let doc: HappyDocument;

    beforeAll(async () => {
        const container = await AstroContainer.create();
        const html = await container.renderToString(Hero);
        const window = new Window();
        window.document.body.innerHTML = html;
        doc = window.document;
    });

    it('renders hero__title, hero__description, and hero__button-container', () => {
        expect(doc.querySelector('.hero__title')).not.toBeNull();
        expect(doc.querySelector('.hero__description')).not.toBeNull();
        expect(doc.querySelector('.hero__button-container')).not.toBeNull();
    });

    it('renders three social-link anchors', () => {
        expect(doc.querySelectorAll('a.social-link')).toHaveLength(3);
    });

    it('wraps PROFIT in span.hero__title-animated', () => {
        const span = doc.querySelector('span.hero__title-animated');
        expect(span).not.toBeNull();
        const text = span?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        expect(text).toContain('PROFIT');
    });
});
