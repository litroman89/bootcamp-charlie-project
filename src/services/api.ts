import { actions } from 'astro:actions';

//1 константы
const LOCALES = {
    EN: 'en',
    RU: 'ru',
    ES: 'es',
} as const;

const DEFAULT_LOCALE = LOCALES.EN;

const PAGES = {
    BENEFITS: 'benefits',
    MULTIPLY: 'multiply',
    TASKS: 'tasks',
} as const;

export const API_HEADERS = {
    'x-api-key': import.meta.env.API_KEY,
};

export const BASE_URL = 'https://cpa-server-vtel.onrender.com';
export const FORM_URL = `${BASE_URL}/form`;

//2 типы
type Locale = (typeof LOCALES)[keyof typeof LOCALES];
// = 'en' | 'ru' | 'es'
type Page = (typeof PAGES)[keyof typeof PAGES];
// = 'benefits' | 'multiply' | 'tasks'

export type ContactFormData = {
    name: string;
    method: 'telegram' | 'whatsapp' | 'email';
    contact: string;
};

// 3 утилита для построения URL
const buildContentUrl = (locale: Locale, page: Page) =>
    `${BASE_URL}/${locale}/${page}`;

const fetchPageContent = async (
    locale: Locale = DEFAULT_LOCALE,
    page: Page,
) => {
    const contentUrl = buildContentUrl(locale, page);
    const response = await fetch(contentUrl, {
        method: 'GET',
        headers: API_HEADERS,
    });

    if (!response.ok) {
        throw new Error(`Ошибка получения страницы: ${response.status}`);
    }

    return await response.json();
};

const postData = async (data: ContactFormData) => {
    const { error } = await actions.sendContactForm(data);

    if (error) {
        throw new Error(`Ошибка при отправке данных: ${error.message}`);
    }
};

export const cpaApi = {
    benefits: (locale?: Locale) => fetchPageContent(locale, PAGES.BENEFITS),
    multiply: (locale?: Locale) => fetchPageContent(locale, PAGES.MULTIPLY),
    tasks: (locale?: Locale) => fetchPageContent(locale, PAGES.TASKS),
    postData: (data: ContactFormData) => postData(data),
};
