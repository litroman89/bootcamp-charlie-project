const buttons = document.querySelectorAll('[data-tab]');
const cards = document.querySelectorAll('[data-card]');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('multiply__btn--active'));
        cards.forEach(c => c.classList.remove('multiply__card--active'));

        btn.classList.add('multiply__btn--active');
        document
            .querySelector(`[data-card="${target}"]`)
            .classList.add('multiply__card--active');
    });
});
