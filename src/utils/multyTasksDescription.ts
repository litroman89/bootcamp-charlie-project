const STRINGS_TO_HIGHLIGHT = ['in-house team'] as const;

/**
 * Wraps configured substrings in `<span>...</span>` for the main card copy.
 * Each phrase is replaced at most once (first occurrence only).
 */
export function formatMultyTasksDescription(text: string): string {
    let result = text;
    for (const phrase of STRINGS_TO_HIGHLIGHT) {
        if (result.includes(phrase)) {
            result = result.replace(phrase, `<span>${phrase}</span>`);
        }
    }
    return result;
}
