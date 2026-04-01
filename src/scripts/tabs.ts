const buttons = document.querySelectorAll<HTMLButtonElement>('[data-tab]');
const cards = document.querySelectorAll<HTMLDivElement>('[data-card]');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('multiply__btn--active'));
        cards.forEach(c => c.classList.remove('multiply__card--active'));

        btn.classList.add('multiply__btn--active');

        const card = document.querySelector<HTMLElement>(
            `[data-card="${target}"]`,
        );
        
        if (card) {
            card.classList.add('multiply__card--active');
        }
    });
});
