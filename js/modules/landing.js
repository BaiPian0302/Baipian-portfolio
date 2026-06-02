import {
    gsap,
    ScrollTrigger,
    lenis,
    MOTION,
    PROJECTS,
    sectionLanding,
    scrollHint,
    dockWrapper,
    createRafThrottled,
} from './core.js?v=20260602-motion-last';
import { switchProject } from './gallery.js?v=20260602-motion-last';
import { initGalleryScroll } from './gallery.js?v=20260602-motion-last';
import { initAboutAnimation } from './about.js?v=20260602-motion-last';
import { initAboutDockHighlight, initGalleryNowPill } from './dock.js?v=20260602-motion-last';

let folderInteractionsReady = false;

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
            const categoryId = folder.dataset.category;
            const pi = folder.dataset.project;
            const guideId = folder.dataset.guide;

            if (categoryId) {
                const targetIndex = PROJECTS.findIndex((project) => project.category === categoryId);
                if (targetIndex >= 0) switchProject(targetIndex);
            } else if (pi !== undefined && pi !== '') {
                switchProject(parseInt(pi, 10));
            } else if (guideId) {
                import('./gallery.js?v=20260602-motion-last').then(({ buildGallery }) => {
                    buildGallery();
                    const target = document.getElementById(guideId);
                    if (target) lenis.scrollTo(target, { offset: -100, duration: 1.2 });
                });
            }
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
    gsap.set(dockWrapper, { y: -36, opacity: 0 });
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
                    initGalleryNowPill();
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


export function initLanding() {
    runLandingAnimation();
}


