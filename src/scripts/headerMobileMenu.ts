/** DOM id for `<dialog>` and matching `data-open-modal` / `aria-controls` on the menu button. */
export const HEADER_MOBILE_NAV_DIALOG_ID = 'header-mobile-nav';

/**
 * Keeps the mobile menu trigger `aria-expanded` in sync with the native `<dialog>` open state.
 */
export function initHeaderMobileMenuAria(): void {
	const btn = document.querySelector<HTMLButtonElement>(
		`[data-open-modal="${HEADER_MOBILE_NAV_DIALOG_ID}"]`,
	);
	const dlg = document.getElementById(HEADER_MOBILE_NAV_DIALOG_ID);

	if (!btn || !(dlg instanceof HTMLDialogElement)) return;

	const setExpanded = (open: boolean) => {
		btn.setAttribute('aria-expanded', open ? 'true' : 'false');
	};

	btn.addEventListener('click', () => {
		queueMicrotask(() => {
			if (dlg.open) setExpanded(true);
		});
	});

	dlg.addEventListener('close', () => setExpanded(false));
	dlg.addEventListener('cancel', () => setExpanded(false));
}
