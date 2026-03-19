import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

// -----------------------------------------------------------------------------
// 1) Переменные
// -----------------------------------------------------------------------------
const sections = gsap.utils.toArray('section');
const ANIMATION_DURATION_SEC = 1;

let isAnimating = false;
let currentIndex = 0; // текущая секция

// -----------------------------------------------------------------------------
// 2) Основная функция перехода к секции
// -----------------------------------------------------------------------------
function goToSection(index) {
    if (isAnimating) return; // если анимация идёт — игнорируем
    if (index < 0 || index >= sections.length) return; // за границы не выходим (начало/конец)

    isAnimating = true;
    currentIndex = index;

    gsap.to(window, {
        scrollTo: sections[index],
        duration: ANIMATION_DURATION_SEC,
        ease: 'power2.inOut',
        overwrite: true, //чтобы новая анимация скролла отменяла предыдущую
        onComplete: () => {
            isAnimating = false; // анимация закончилась — разблокируем
            //можно сюда вставить анимации секций (если надо будет animateSection(index))
        },
    });
}

// -----------------------------------------------------------------------------
// 3) Слушатели событий
// -----------------------------------------------------------------------------
// вешаем обработчик на скролл.
window.addEventListener(
    'wheel',
    e => {
        e.preventDefault(); // отменяем нативный скролл браузера

        if (isAnimating) return; // блокируем если анимация идёт

        if (e.deltaY > 0) {
            goToSection(currentIndex + 1); // скролл вниз — следующая секция
        } else {
            goToSection(currentIndex - 1); // скролл вверх — предыдущая секция
        }
    },
    { passive: false },
); // passive: false обязателен для preventDefault

// Кнопка наверх
document
    .querySelector('#to-top')
    .addEventListener('click', () => goToSection(0));

// NAV обработчик на ссылки в наве.
document.querySelector('nav').addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const index = Number(link.dataset.section);
    goToSection(index);
});
