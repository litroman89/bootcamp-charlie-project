// import gsap from 'gsap';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// gsap.registerPlugin(ScrollToPlugin);

// // -----------------------------------------------------------------------------
// // 1) Переменные
// // -----------------------------------------------------------------------------
// const sections = gsap.utils.toArray<HTMLElement>('section');
// const ANIMATION_DURATION_SEC = 1;

// let isAnimating = false;
// let currentIndex = 0; // текущая секция

// // -----------------------------------------------------------------------------
// // 2) Основная функция перехода к секции
// // -----------------------------------------------------------------------------
// function goToSection(index:number) {
//     if (isAnimating) return; // если анимация идёт — игнорируем
//     if (index < 0 || index >= sections.length) return; // за границы не выходим (начало/конец)

//     isAnimating = true;
//     currentIndex = index;

//     gsap.to(window, {
//         scrollTo: sections[index],
//         duration: ANIMATION_DURATION_SEC,
//         ease: 'power2.inOut',
//         overwrite: true, //чтобы новая анимация скролла отменяла предыдущую
//         onComplete: () => {
//             isAnimating = false; // анимация закончилась — разблокируем
//             //можно сюда вставить анимации секций (если надо будет animateSection(index))
//         },
//     });
// }

// // -----------------------------------------------------------------------------
// // 3) Слушатели событий
// // -----------------------------------------------------------------------------
// // вешаем обработчик на скролл.
// window.addEventListener(
//     'wheel',
//     e => {
//         e.preventDefault(); // отменяем нативный скролл браузера

//         if (isAnimating) return; // блокируем если анимация идёт

//         if (e.deltaY > 0) {
//             goToSection(currentIndex + 1); // скролл вниз — следующая секция
//         } else {
//             goToSection(currentIndex - 1); // скролл вверх — предыдущая секция
//         }
//     },
//     { passive: false },
// ); // passive: false обязателен для preventDefault

// // Кнопка наверх
// document
//     .querySelector<HTMLButtonElement>('#to-top')!
//     .addEventListener('click', () => goToSection(0));

// // Навигация по секциям: делегирование (десктопный nav + мобильное меню в dialog).
// document.addEventListener('click', e => {
//     const link = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[data-section]');
//     if (!link) return;

//     const index = Number(link.dataset.section);
//     if (!Number.isInteger(index)) return;

//     e.preventDefault();
//     goToSection(index);
// });

// //обработчик на клавиши
// window.addEventListener('keydown', e => {
//     if (e.key === 'ArrowDown') {
//         e.preventDefault();
//         goToSection(currentIndex + 1);
//     } else if (e.key === 'ArrowUp') {
//         e.preventDefault();
//         goToSection(currentIndex - 1);
//     }
// });

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

// -----------------------------------------------------------------------------
// 1) Переменные
// -----------------------------------------------------------------------------
const sections = gsap.utils.toArray<HTMLElement>('section');
const ANIMATION_DURATION_SEC = 1;
let isAnimating = false;
let currentIndex = 0;

// -----------------------------------------------------------------------------
// 2) Основная функция перехода к секции
// -----------------------------------------------------------------------------
function goToSection(index: number) {
    if (isAnimating) return;
    if (index < 0 || index >= sections.length) return;

    isAnimating = true;
    currentIndex = index;

    gsap.to(window, {
        scrollTo: sections[index],
        duration: ANIMATION_DURATION_SEC,
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: () => {
            isAnimating = false;
        },
    });
}

// -----------------------------------------------------------------------------
// 3) Включение / выключение постраничного скролла
// -----------------------------------------------------------------------------
let wheelHandler: (e: WheelEvent) => void;
let keyHandler: (e: KeyboardEvent) => void;

function enablePageScroll() {
    wheelHandler = e => {
        e.preventDefault();
        if (isAnimating) return;
        e.deltaY > 0
            ? goToSection(currentIndex + 1)
            : goToSection(currentIndex - 1);
    };

    keyHandler = e => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            goToSection(currentIndex + 1);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            goToSection(currentIndex - 1);
        }
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler);
}

function disablePageScroll() {
    window.removeEventListener('wheel', wheelHandler);
    window.removeEventListener('keydown', keyHandler);
}

// -----------------------------------------------------------------------------
// 4) Слушатели которые работают всегда (кнопка, навигация)
// -----------------------------------------------------------------------------
document
    .querySelector<HTMLButtonElement>('#to-top')!
    .addEventListener('click', () => goToSection(0));

document.addEventListener('click', e => {
    const link = (e.target as HTMLElement)?.closest<HTMLAnchorElement>(
        'a[data-section]',
    );
    if (!link) return;
    const index = Number(link.dataset.section);
    if (!Number.isInteger(index)) return;
    e.preventDefault();
    goToSection(index);
});

// -----------------------------------------------------------------------------
// 5) Переключение по брейкпоинту
// -----------------------------------------------------------------------------
const mq = window.matchMedia('(max-width: 767px)');

function handleBreakpoint(e: MediaQueryListEvent | MediaQueryList) {
    if (e.matches) {
        disablePageScroll(); // мобилка — выключаем
    } else {
        enablePageScroll(); // десктоп — включаем
    }
}

mq.addEventListener('change', handleBreakpoint); // срабатывает при повороте / resize
handleBreakpoint(mq); // запускаем сразу при загрузке
