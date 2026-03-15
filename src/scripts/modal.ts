let isModalListenerAdded = false;

export function initModal(defaultId?: string) {
	if (isModalListenerAdded) return;

	document.addEventListener('click', e => {
		const target = e.target as HTMLElement;

		const openTrigger = target?.closest?.('[data-open-modal]');
		if (openTrigger) {
			const modalId = openTrigger.getAttribute('data-open-modal') || defaultId;
			if (modalId) {
				const dialog = document.getElementById(modalId) as HTMLDialogElement;
				if (dialog && typeof dialog.showModal === 'function') {
					dialog.showModal();
				}
			}
		}

		const closeTrigger = target?.closest?.('[data-modal-close]');
		if (closeTrigger) {
			const dialog = closeTrigger.closest('dialog');
			if (dialog) dialog.close();
		}

		if (target?.tagName === 'DIALOG' && (target as HTMLDialogElement).open) {
			(target as HTMLDialogElement).close();
		}
	});

	isModalListenerAdded = true;
}
