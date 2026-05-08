import { gsap } from './core.js?v=20260508-structure-fix';

function initLiquidGlass() {
    const pill = document.querySelector('.title-glow-pill');
    if (!pill) return;

    const timeline = gsap.timeline({ repeat: -1 });
    timeline
        .to(pill, { x: 80, y: -50, rotation: 1.5, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 160, y: 40, rotation: -1, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 240, y: -50, rotation: 1.5, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 320, y: 40, rotation: -1, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 240, y: -50, rotation: 1.5, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 160, y: 40, rotation: -1, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 80, y: -50, rotation: 1.5, duration: 3, ease: 'sine.inOut', force3D: true })
        .to(pill, { x: 0, y: 0, rotation: 0, duration: 3, ease: 'sine.inOut', force3D: true });
}

function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!cursor || !hasPointer) return;

    document.body.classList.add('cursor-active');

    const moveCursorX = gsap.quickTo(cursor, 'left', { duration: 0.12, ease: 'power2.out' });
    const moveCursorY = gsap.quickTo(cursor, 'top', { duration: 0.12, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
        moveCursorX(e.clientX);
        moveCursorY(e.clientY);
        if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
    }, { passive: true });

    window.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    window.addEventListener('mouseenter', () => cursor.classList.add('visible'));

    const hoverSelector = [
        'a', 'button', '[role="button"]',
        '.folder-card', '.bento-item',
        '.sidebar-category', '.sc-project',
    ].join(', ');

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverSelector)) cursor.classList.add('cursor-hover');
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverSelector)) cursor.classList.remove('cursor-hover');
    }, { passive: true });
}


export function initVisualEffects() {
    initLiquidGlass();
    initCustomCursor();
}


