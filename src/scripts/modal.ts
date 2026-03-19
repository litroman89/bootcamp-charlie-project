// -- Modal Window Management --

export function openDialogById(id: string) {
	const dialog = document.getElementById(id) as HTMLDialogElement | null;
	if (dialog && typeof dialog.showModal === 'function') {
		dialog.showModal();
	}
}

export function closeDialog(dialog: HTMLDialogElement | null) {
	if (dialog) {
		dialog.close();
	}
}

export function handleGlobalClickForModals(e: MouseEvent, defaultId?: string) {
	const target = e.target as HTMLElement;

	const openTrigger = target?.closest?.('[data-open-modal]');
	if (openTrigger) {
		const modalId = openTrigger.getAttribute('data-open-modal') || defaultId;
		if (modalId) {
			openDialogById(modalId);
		}
	}

	const closeTrigger = target?.closest?.('[data-modal-close]');
	if (closeTrigger) {
		closeDialog(closeTrigger.closest('dialog'));
	}

	// Click on backdrop (dialog itself)
	if (target?.tagName === 'DIALOG' && (target as HTMLDialogElement).open) {
		closeDialog(target as HTMLDialogElement);
	}
}

let isModalListenerAdded = false;

export function ensureModalClickListenerOnce(defaultId?: string) {
	if (isModalListenerAdded) return;
	document.addEventListener('click', (e) => handleGlobalClickForModals(e, defaultId));
	isModalListenerAdded = true;
}

// -- Form Handling --

export function resetContactCustomSelect(form: HTMLFormElement) {
	const select = form.querySelector('.custom-select');
	if (!select) return;

	const valueDisplay = select.querySelector('.custom-select__value');
	const hiddenInput = select.querySelector('#variant-input');
	const options = select.querySelectorAll('.custom-select__option');

	if (valueDisplay) {
		valueDisplay.textContent = 'Contact Method*';
		valueDisplay.classList.add('placeholder');
	}

	if (hiddenInput instanceof HTMLInputElement) {
		hiddenInput.value = '';
	}

	options.forEach(opt => opt.classList.remove('is-selected'));
}

export function resetContactForm(form: HTMLFormElement) {
	form.reset();
	resetContactCustomSelect(form);
}

export function handleFormSuccess(form: HTMLFormElement) {
	resetContactForm(form);
	closeDialog(form.closest('dialog'));
	openDialogById('success-modal');
}

export function handleFormError(error: unknown, defaultMessage: string = 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.') {
	console.error('Form error:', error);
	alert(defaultMessage);
}

type ContactMethod = 'telegram' | 'whatsapp' | 'email';

type SubmitContactFormResponse = {
	success?: boolean;
	message?: string;
};

export async function submitContactForm(form: HTMLFormElement) {
	const formData = new FormData(form);
	const payload = {
		name: formData.get('name')?.toString().trim() || undefined,
		method: formData.get('method')?.toString() as ContactMethod,
		contact: formData.get('contact')?.toString().trim() ?? '',
	};

	try {
		const response = await fetch('/api/send-contact-form', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
		const result = (await response.json().catch(() => null)) as SubmitContactFormResponse | null;

		if (response.ok && result?.success) {
			handleFormSuccess(form);
		} else {
			handleFormError(
				new Error(result?.message ?? `Request failed with status ${response.status}`),
				result?.message,
			);
		}
	} catch (err) {
		handleFormError(err, 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
	}
}

export function setupContactFormHandler(form: HTMLFormElement) {
	if (form.dataset.isInitialized === 'true') return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		await submitContactForm(form);
	});

	form.dataset.isInitialized = 'true';
}

// -- Initialization --

export function initModals(options?: { defaultId?: string }) {
	ensureModalClickListenerOnce(options?.defaultId);

	const form = document.getElementById('contact-form');
	if (form instanceof HTMLFormElement) {
		setupContactFormHandler(form);
	}
}

// Backward compatibility
export function initModal(defaultId?: string) {
	initModals({ defaultId });
}
