const navTranslations = {
    en: {
        'nav.team': 'Team',
        'nav.benefits': 'Benefits',
        'nav.join': 'Join Us',
    },
    ru: {
        'nav.team': 'Команда',
        'nav.benefits': 'Преимущества',
        'nav.join': 'Присоединяйтесь',
    },
} as const;

export type SupportedLang = keyof typeof navTranslations;

export function tNav(lang: SupportedLang, key: string): string {
    return navTranslations[lang]?.[key as keyof typeof navTranslations[SupportedLang]] ?? key;
}