import { ScrollTrigger, contactModal, scrollToTop } from './core.js?v=20260602-operational-update';

let resizeTimer;

function initGlobalEvents() {
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;

        if (contactModal?.classList.contains('active')) {
            window.__closeContactModal?.();
            return;
        }

        scrollToTop();
    });
}


export { initGlobalEvents };

