import { actions } from 'astro:actions';

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

	const form = document.getElementById('contact-form');
	if (form instanceof HTMLFormElement) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			
			try {
				const { data, error } = await actions.sendContactForm(formData);
				
				if (data?.success) {
					form.reset();
					
					// Reset custom select
					const select = form.querySelector('.custom-select');
					const valueDisplay = select?.querySelector('.custom-select__value');
					const hiddenInput = select?.querySelector('#variant-input');
					const options = select?.querySelectorAll('.custom-select__option');
					
					if (valueDisplay) {
						valueDisplay.textContent = 'Contact Method*';
						valueDisplay.classList.add('placeholder');
					}
					
					if (hiddenInput && hiddenInput instanceof HTMLInputElement) {
						hiddenInput.value = '';
					}
					
					options?.forEach(opt => opt.classList.remove('is-selected'));
					
					// Close current modal
					const currentModal = form.closest('dialog');
					if (currentModal) currentModal.close();
					
					// Open success modal
					const successModal = document.getElementById('success-modal');
					if (successModal instanceof HTMLDialogElement) {
						successModal.showModal();
					}
				} else if (error) {
					console.error('Form submission error:', error);
					alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
				}
			} catch (err) {
				console.error('Unexpected error:', err);
				alert('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
			}
		});
	}

	isModalListenerAdded = true;
}
