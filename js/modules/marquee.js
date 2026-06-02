import { gsap } from './core.js?v=20260602-sidebar-order-fix';

function initMarquee() {
    const section = document.getElementById('section-marquee');
    if (!section) return;

    const inner = section.querySelector('.marquee-inner');
    if (!inner) return;

    inner.innerHTML += inner.innerHTML;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    const getComputedTranslateX = () => {
        const style = window.getComputedStyle(inner);
        const matrix = new DOMMatrix(style.transform);
        return matrix.m41;
    };

    section.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        currentTranslate = getComputedTranslateX();
        inner.style.animationPlayState = 'paused';
        section.classList.add('dragging');
        section.setPointerCapture(e.pointerId);
    });

    section.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        inner.style.transform = `translateX(${currentTranslate + dx}px)`;
    });

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        section.classList.remove('dragging');
        inner.style.transform = '';
        inner.style.animationPlayState = '';
    };

    section.addEventListener('pointerup', endDrag);
    section.addEventListener('pointercancel', endDrag);
    section.addEventListener('mouseenter', () => {
        if (!isDragging) inner.style.animationDuration = '40s';
    });
    section.addEventListener('mouseleave', () => {
        if (!isDragging) inner.style.animationDuration = '';
    });
}


export { initMarquee };

