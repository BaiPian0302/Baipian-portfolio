import {
    gsap,
    ScrollTrigger,
    lenis,
    MOTION,
    sectionLanding,
    scrollHint,
    sectionAbout,
    contactModal,
    modalCloseBtn,
    dockWrapper,
    createRafThrottled,
    scrollToTop,
} from './core.js';
import { switchProject, initGalleryScroll } from './gallery.js';
import { initAboutDockHighlight, updateDockMetrics } from './dock.js';
import { initScrollSnap } from './scroll-snap.js';

let folderInteractionsReady = false;
let resizeTimer;

function initLandingScrollExit() {
    gsap.timeline({
        scrollTrigger: {
            trigger: sectionLanding,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
        },
    }).to(scrollHint, { opacity: 0 }, 0);

    gsap.to('.title-container', {
        y: -180,
        scale: 0.92,
        opacity: 0,
        scrollTrigger: { trigger: sectionLanding, start: 'top top', end: '60% top', scrub: 0.4 },
    });

    gsap.to('.accent-dots-grid', {
        y: -60,
        opacity: 0,
        scrollTrigger: { trigger: sectionLanding, start: 'top top', end: '50% top', scrub: 0.3 },
    });

    gsap.to('.landing-subtitle', {
        y: -120,
        opacity: 0,
        scrollTrigger: { trigger: sectionLanding, start: 'top top', end: '55% top', scrub: 0.4 },
    });

    gsap.to('.landing-note', {
        y: -80,
        opacity: 0,
        scrollTrigger: { trigger: sectionLanding, start: 'top top', end: '50% top', scrub: 0.35 },
    });

    document.querySelectorAll('.folder-card').forEach((folder, index) => {
        const speed = parseFloat(folder.dataset.speed) || 0.5;
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.to(folder, {
            y: -200 * speed,
            x: direction * 40 * speed,
            rotation: direction * 3 * speed,
            opacity: 0,
            scale: 0.85,
            scrollTrigger: {
                trigger: sectionLanding,
                start: 'top top',
                end: '70% top',
                scrub: 0.3 + index * 0.05,
            },
        });
    });
}

function initFloatingEffect() {
    const floatItems = gsap.utils.toArray('.float-item');
    if (!floatItems.length) return;

    const cardSprings = floatItems.map((card) => {
        const speed = parseFloat(card.dataset.speed) || 0.5;
        return {
            speed,
            moveX: gsap.quickTo(card, 'x', { duration: 0.8, ease: 'power2.out' }),
        };
    });

    floatItems.forEach((card) => {
        const speed = parseFloat(card.dataset.speed) || 0.5;
        gsap.to(card, {
            yPercent: gsap.utils.random(-6, 6) * speed,
            rotation: gsap.utils.random(-3, 3) * speed,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2,
            force3D: true,
        });
    });

    window.addEventListener('mousemove', createRafThrottled((e) => {
        const ratioX = e.clientX / window.innerWidth - 0.5;
        cardSprings.forEach(({ speed, moveX }) => moveX(ratioX * 50 * speed));
    }), { passive: true });
}

function initFolderInteractions() {
    if (folderInteractionsReady) return;
    folderInteractionsReady = true;

    document.querySelectorAll('.folder-card').forEach((folder) => {
        const flap = folder.querySelector('.folder-flap');
        const photos = folder.querySelectorAll('.folder-photo');

        folder.addEventListener('pointerenter', () => {
            gsap.to(folder, { scale: 1.03, y: -4, duration: MOTION.base, ease: MOTION.easeStrong, overwrite: 'auto' });
            if (flap) {
                gsap.to(flap, { rotateX: -16, duration: MOTION.slow, ease: MOTION.easeStrong, overwrite: 'auto' });
            }

            const offsets = [-14, -22, -16];
            photos.forEach((photo, index) => {
                gsap.to(photo, {
                    y: offsets[index] ?? -22,
                    scale: 1.025,
                    duration: MOTION.slow,
                    delay: index * 0.05,
                    ease: MOTION.easeStrong,
                    overwrite: 'auto',
                });
            });
        });

        folder.addEventListener('pointerleave', () => {
            gsap.to(folder, { scale: 1, y: 0, rotateY: 0, rotateX: 0, duration: MOTION.slow, ease: MOTION.easeStrong, overwrite: 'auto' });
            if (flap) {
                gsap.to(flap, { rotateX: 0, duration: MOTION.base, ease: MOTION.easeStrong, overwrite: 'auto' });
            }

            photos.forEach((photo, index) => {
                gsap.to(photo, {
                    y: 0,
                    scale: 1,
                    duration: MOTION.base,
                    delay: index * 0.03,
                    ease: 'power3.inOut',
                    overwrite: 'auto',
                });
            });
        });

        folder.addEventListener('pointerdown', () => {
            gsap.fromTo(folder, { scale: 0.99 }, { scale: 1.02, duration: MOTION.fast, ease: MOTION.easeOut, overwrite: 'auto' });
        });

        folder.addEventListener('click', () => {
            const pi = folder.dataset.project;
            if (pi !== undefined && pi !== '') switchProject(parseInt(pi, 10));
        });
    });
}

function runLandingAnimation() {
    lenis.stop();

    const folders = gsap.utils.toArray('.folder-card');
    const folderEntrances = [
        { x: -120, y: -60, rotation: -12 },
        { x: 120,  y: -80, rotation: 10 },
        { x: -100, y: 60,  rotation: 8 },
        { x: 100,  y: 80,  rotation: -10 },
    ];

    gsap.set('.title-svg', { opacity: 0, scale: 1.12, filter: 'blur(12px)' });
    gsap.set('.title-shadow-svg', { opacity: 0, scale: 1.15 });
    gsap.set('.title-glow-pill', { opacity: 0, scale: 0.6 });
    gsap.set('.title-author', { opacity: 0, y: 18, clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.title-year', { opacity: 0, y: -18, clipPath: 'inset(0 0 100% 0)' });
    gsap.set('.landing-subtitle', { opacity: 0, y: 30, letterSpacing: '0.3em' });
    gsap.set('.accent-dots-grid', { opacity: 0, scale: 0.5, rotation: -15 });
    gsap.set('.landing-note-left', { opacity: 0, x: -50, y: 15 });
    gsap.set('.landing-note-right', { opacity: 0, x: 50, y: 15 });
    folders.forEach((f, i) => {
        const e = folderEntrances[i] || folderEntrances[0];
        gsap.set(f, { opacity: 0, scale: 0.6, x: e.x, y: e.y, rotation: e.rotation });
    });
    gsap.set(dockWrapper, { y: 80, opacity: 0 });
    gsap.set(scrollHint, { opacity: 0, y: 10 });

    const tl = gsap.timeline({
        onComplete: () => {
            lenis.start();
            requestAnimationFrame(() => {
                initFloatingEffect();
                initFolderInteractions();
                requestAnimationFrame(() => {
                    initGalleryScroll();
                    initLandingScrollExit();
                    initAboutAnimation();
                    initAboutDockHighlight();
                    ScrollTrigger.refresh();
                });
            });
        },
    });

    tl
        // Phase 1 — Title reveal with blur-to-sharp
        .to('.title-svg', {
            opacity: 1, scale: 1, filter: 'blur(0px)',
            duration: 1.6, ease: 'expo.out',
        })
        .to('.title-shadow-svg', {
            opacity: 1, scale: 1,
            duration: 1.4, ease: 'expo.out',
        }, 0.1)
        .to('.title-glow-pill', {
            opacity: 1, scale: 1,
            duration: 1.2, ease: 'back.out(1.6)',
        }, 0.6)

        // Phase 2 — Identity clip-in
        .to('.title-author', {
            opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
            duration: 0.9, ease: 'power3.out',
        }, 0.7)
        .to('.title-year', {
            opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
            duration: 0.9, ease: 'power3.out',
        }, 0.8)

        // Phase 3 — Accent dots spin in
        .to('.accent-dots-grid', {
            opacity: 1, scale: 1, rotation: 0,
            duration: 1.2, ease: 'back.out(2)',
        }, 0.9)

        // Phase 4 — Subtitle with letter-spacing settle
        .to('.landing-subtitle', {
            opacity: 1, y: 0, letterSpacing: '0em',
            duration: 1.3, ease: 'power3.out',
        }, 1.1)

        // Phase 5 — Notes slide in from sides
        .to('.landing-note-left', {
            opacity: 1, x: 0, y: 0,
            duration: 1.1, ease: 'power3.out',
        }, 1.6)
        .to('.landing-note-right', {
            opacity: 1, x: 0, y: 0,
            duration: 1.1, ease: 'power3.out',
        }, 1.8)

        // Phase 6 — Folders fly in from corners
        .to(folders, {
            opacity: 1, scale: 1, x: 0, y: 0, rotation: 0,
            duration: 1.4, stagger: 0.15,
            ease: 'back.out(1.4)',
        }, 1.9)

        // Phase 7 — UI chrome
        .to(dockWrapper, {
            y: 0, opacity: 1,
            duration: 1.0, ease: 'power3.out',
        }, '-=0.6')
        .to(scrollHint, {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'power2.out',
        }, '-=0.5');
}

function initAboutAnimation() {
    if (!sectionAbout) return;

    const title = sectionAbout.querySelector('.about-header');
    const items = sectionAbout.querySelectorAll('.bento-item');

    if (title) {
        gsap.fromTo(title,
            { opacity: 0, y: 80, scale: 0.94 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionAbout,
                    start: 'top 90%',
                    end: 'top 55%',
                    scrub: 0.4,
                },
            }
        );
    }

    if (!items.length) return;

    const cardConfig = {
        'item-bio': { y: 100, scale: 0.94, scrub: 0.35, start: 82, end: 48 },
        'item-avatar': { y: 120, scale: 0.92, scrub: 0.45, start: 80, end: 46 },
        'item-stats': { y: 140, scale: 0.90, scrub: 0.5, start: 78, end: 44 },
        'item-exp1': { y: 110, scale: 0.93, scrub: 0.4, start: 74, end: 40 },
        'item-exp2': { y: 130, scale: 0.91, scrub: 0.5, start: 72, end: 38 },
        'item-tools': { y: 150, scale: 0.88, scrub: 0.55, start: 70, end: 36 },
        'item-intern': { y: 90, scale: 0.95, scrub: 0.45, start: 66, end: 34 },
    };

    items.forEach((item) => {
        let config = { y: 100, scale: 0.94, scrub: 0.4, start: 80, end: 48 };
        for (const [cls, value] of Object.entries(cardConfig)) {
            if (item.classList.contains(cls)) {
                config = value;
                break;
            }
        }

        gsap.fromTo(item,
            { opacity: 0, y: config.y, scale: config.scale },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionAbout,
                    start: `top ${config.start}%`,
                    end: `top ${config.end}%`,
                    scrub: config.scrub,
                },
            }
        );
    });
}

export function initContactModal() {
    if (!contactModal) return;

    const openModal = () => {
        contactModal.classList.add('active');
        lenis.stop();
    };

    const closeModal = () => {
        contactModal.classList.remove('active');
        lenis.start();
    };

    modalCloseBtn?.addEventListener('click', closeModal);
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    const copyButton = contactModal.querySelector('.copy-wechat');
    if (copyButton) {
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard?.writeText(copyButton.dataset.wechat).then(() => {
                const hint = copyButton.querySelector('.copy-hint');
                if (hint) hint.textContent = '已复制!';
                copyButton.classList.add('copied');
                setTimeout(() => {
                    if (hint) hint.textContent = '点击复制';
                    copyButton.classList.remove('copied');
                }, 2000);
            });
        });
    }

    window.__openContactModal = openModal;
    window.__closeContactModal = closeModal;
}

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
    if (!cursor || 'ontouchstart' in window) return;

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

function initGlobalEvents() {
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
            updateDockMetrics();
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

export function initAfterLoad() {
    runLandingAnimation();
    initLiquidGlass();
    initCustomCursor();
    initMarquee();
    initScrollSnap();
    initGlobalEvents();
}
