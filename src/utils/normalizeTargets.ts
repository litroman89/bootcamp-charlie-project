export type Targets = string | Element | Element[] | NodeListOf<Element> | Array<string | Element>;

export function normalizeTargets(targets: Targets): Element[] {
    if (typeof window === 'undefined') return [];

    if (typeof targets === 'string') {
        return Array.from(document.querySelectorAll(targets));
    }
    if (targets instanceof Element) {
        return [targets];
    }
    if (targets instanceof NodeList) {
        return Array.from(targets) as Element[];
    }
    if (Array.isArray(targets)) {
        return targets.flatMap((t) => {
            if (typeof t === 'string') {
                return Array.from(document.querySelectorAll(t));
            }
            if (t instanceof Element) {
                return t;
            }
            return [];
        });
    }
    return [];
}
