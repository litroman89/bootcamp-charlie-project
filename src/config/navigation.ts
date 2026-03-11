export type NavItem = {
    id: string;         // стабильный ключ
    href: string;       // путь или anchor
    i18nKey: string;    // ключ для перевода
};

export const mainNav: NavItem[] = [
    { id: 'team', href: '#team', i18nKey: 'nav.team' },
    { id: 'benefits', href: '#benefits', i18nKey: 'nav.benefits' },
    { id: 'join', href: '#join', i18nKey: 'nav.join' },
];