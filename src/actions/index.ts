import { z } from 'astro/zod';
import { ActionError, defineAction } from 'astro:actions';

import { API_HEADERS, FORM_URL } from '../services/api';

export const server = {
    sendContactForm: defineAction({
        accept: "form",
        input: z.object({
            name: z.string().optional(),
            method: z.enum(['telegram', 'whatsapp', 'email']),
            contact: z.string(),
        }),
        handler: async (input) => {
            const response = await fetch(FORM_URL, {
                method: 'POST',
                headers: { ...API_HEADERS, 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: `Ошибка при отправке данных: ${response.status}`,
                });
            }

            return { success: true };
        },
    }),
};
