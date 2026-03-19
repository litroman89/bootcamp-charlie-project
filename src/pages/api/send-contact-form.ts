import type { APIRoute } from 'astro';
import { z } from 'astro/zod';

export const prerender = false;

const FORM_URL = 'https://cpa-server-vtel.onrender.com/form';

const contactFormSchema = z.object({
	name: z.string().optional(),
	method: z.enum(['telegram', 'whatsapp', 'email']),
	contact: z.string().min(1),
});

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.API_KEY;

	if (!apiKey) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Server is not configured correctly.',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}

	try {
		const body = await request.json();
		const input = contactFormSchema.parse(body);
		const response = await fetch(FORM_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
			},
			body: JSON.stringify(input),
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({
					success: false,
					message: `Ошибка при отправке данных: ${response.status}`,
				}),
				{
					status: response.status,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Некорректные данные формы.',
					errors: error.flatten(),
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		return new Response(
			JSON.stringify({
				success: false,
				message: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}
};
