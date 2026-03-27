import { beforeEach,describe, expect, it, vi } from 'vitest';

import { buildContentUrl, cpaApi } from './api';

// --- Unit тесты чистой функции ---
describe('buildContentUrl', () => {
    it('строит корректный URL', () => {
        expect(buildContentUrl('ru', 'benefits')).toBe(
            'https://cpa-server-vtel.onrender.com/ru/benefits',
        );
    });

    it('работает с дефолтной локалью en', () => {
        expect(buildContentUrl('en', 'multiply')).toBe(
            'https://cpa-server-vtel.onrender.com/en/multiply',
        );
    });
});

// --- Тесты с моком fetch ---
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('cpaApi.benefits', () => {
    beforeEach(() => {
        mockFetch.mockClear(); // сбрасываем мок перед каждым тестом
    });

    it('вызывает правильный URL с заголовками', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        await cpaApi.benefits('ru');

        expect(mockFetch).toHaveBeenCalledWith(
            'https://cpa-server-vtel.onrender.com/ru/benefits',
            expect.objectContaining({ method: 'GET' }),
        );
    });

    it('бросает ошибку если response.ok === false', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

        await expect(cpaApi.benefits()).rejects.toThrow(
            'Ошибка получения страницы: 404',
        );
    });
});
