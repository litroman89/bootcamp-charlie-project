/** @vitest-environment node */

import { describe, expect, it } from 'vitest';

import { formatMultyTasksDescription } from './multyTasksDescription';

describe('formatMultyTasksDescription', () => {
    it('wraps the first occurrence of in-house team in a span', () => {
        const input = 'We run an in-house team of media buyers.';
        expect(formatMultyTasksDescription(input)).toBe(
            'We run an <span>in-house team</span> of media buyers.',
        );
    });

    it('leaves text unchanged when the phrase is absent', () => {
        const input = 'We run a remote team of media buyers.';
        expect(formatMultyTasksDescription(input)).toBe(input);
    });

    it('replaces only the first occurrence when the phrase appears multiple times', () => {
        const input = 'in-house team and another in-house team here';
        expect(formatMultyTasksDescription(input)).toBe(
            '<span>in-house team</span> and another in-house team here',
        );
    });

    it('returns an empty string for empty input', () => {
        expect(formatMultyTasksDescription('')).toBe('');
    });
});
