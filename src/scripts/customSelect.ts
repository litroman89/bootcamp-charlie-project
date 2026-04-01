export interface CustomSelectContext {
	root: HTMLElement;
	trigger: HTMLButtonElement;
	header: HTMLButtonElement;
	options: NodeListOf<HTMLElement>;
	hiddenInput: HTMLInputElement;
	valueDisplays: NodeListOf<HTMLElement>;
}

export function queryCustomSelectElements(root: HTMLElement): CustomSelectContext | null {
	const trigger = root.querySelector('.custom-select__trigger') as HTMLButtonElement;
	const header = root.querySelector('.custom-select__dropdown-header') as HTMLButtonElement;
	const options = root.querySelectorAll('.custom-select__option') as NodeListOf<HTMLElement>;
	const hiddenInput = root.querySelector('#variant-input') as HTMLInputElement;
	const valueDisplays = root.querySelectorAll('.custom-select__value') as NodeListOf<HTMLElement>;

	if (!trigger || !header || !hiddenInput) return null;

	return { root, trigger, header, options, hiddenInput, valueDisplays };
}

export function toggleSelectOpen(context: CustomSelectContext) {
	const { root, trigger } = context;
	root.classList.toggle('is-open');
	const isOpen = root.classList.contains('is-open');
	trigger.setAttribute('aria-expanded', String(isOpen));
}

export function closeSelect(root: HTMLElement) {
	root.classList.remove('is-open');
	const trigger = root.querySelector('.custom-select__trigger');
	if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

export function handleOptionSelect(option: HTMLElement, context: CustomSelectContext) {
	const { options, hiddenInput, valueDisplays } = context;
	
	options.forEach(opt => opt.classList.remove('is-selected'));
	option.classList.add('is-selected');

	const value = option.getAttribute('data-value');
	const text = option.textContent;

	if (value) hiddenInput.value = value;

	valueDisplays.forEach(display => {
		if (text) display.textContent = text;
		display.classList.remove('placeholder');
	});

	toggleSelectOpen(context);
}

export function setupToggleHandlers(context: CustomSelectContext) {
	const { trigger, header } = context;
	
	trigger.addEventListener('click', e => {
		e.preventDefault();
		toggleSelectOpen(context);
	});

	header.addEventListener('click', e => {
		e.preventDefault();
		toggleSelectOpen(context);
	});
}

export function attachOptionsHandlers(context: CustomSelectContext) {
	context.options.forEach(option => {
		option.addEventListener('click', () => handleOptionSelect(option, context));
	});
}

let isDocumentListenerAdded = false;

export function ensureDocumentClickListenerOnce() {
	if (isDocumentListenerAdded) return;
	
	document.addEventListener('click', e => {
		const target = e.target as HTMLElement;
		const allSelects = document.querySelectorAll('.custom-select');
		allSelects.forEach(select => {
			if (!select.contains(target)) {
				closeSelect(select as HTMLElement);
			}
		});
	});
	
	isDocumentListenerAdded = true;
}

export function initCustomSelect(root: ParentNode = document) {
	const customSelects = root.querySelectorAll('.custom-select:not(.is-initialized)');

	customSelects.forEach(select => {
		select.classList.add('is-initialized');

		const context = queryCustomSelectElements(select as HTMLElement);
		if (!context) return;

		setupToggleHandlers(context);
		attachOptionsHandlers(context);
	});

	ensureDocumentClickListenerOnce();
}

export function initCustomSelects() {
	initCustomSelect(document);
}
