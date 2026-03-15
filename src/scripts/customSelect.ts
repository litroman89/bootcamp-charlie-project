let isDocumentListenerAdded = false;

export function initCustomSelects() {
	const customSelects = document.querySelectorAll('.custom-select:not(.is-initialized)');

	customSelects.forEach(select => {
		select.classList.add('is-initialized');

		const trigger = select.querySelector('.custom-select__trigger') as HTMLButtonElement;
		const header = select.querySelector('.custom-select__dropdown-header') as HTMLButtonElement;
		const options = select.querySelectorAll('.custom-select__option');
		const hiddenInput = select.querySelector('#variant-input') as HTMLInputElement;
		const valueDisplays = select.querySelectorAll('.custom-select__value');

		if (!trigger || !header || !hiddenInput) return;

		const toggleOpen = () => {
			select.classList.toggle('is-open');
			const isOpen = select.classList.contains('is-open');
			trigger.setAttribute('aria-expanded', String(isOpen));
		};

		trigger.addEventListener('click', e => {
			e.preventDefault();
			toggleOpen();
		});

		header.addEventListener('click', e => {
			e.preventDefault();
			toggleOpen();
		});

		options.forEach(option => {
			option.addEventListener('click', () => {
				options.forEach(opt => opt.classList.remove('is-selected'));
				option.classList.add('is-selected');

				const value = option.getAttribute('data-value');
				const text = option.textContent;

				if (value) hiddenInput.value = value;

				valueDisplays.forEach(display => {
					if (text) display.textContent = text;
					display.classList.remove('placeholder');
				});

				toggleOpen();
			});
		});
	});

	// Close on click outside
	if (!isDocumentListenerAdded) {
		document.addEventListener('click', e => {
			const target = e.target as HTMLElement;
			const allSelects = document.querySelectorAll('.custom-select');
			allSelects.forEach(select => {
				if (!select.contains(target)) {
					select.classList.remove('is-open');
					const trigger = select.querySelector('.custom-select__trigger');
					if (trigger) trigger.setAttribute('aria-expanded', 'false');
				}
			});
		});
		isDocumentListenerAdded = true;
	}
}
