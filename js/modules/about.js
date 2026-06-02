import { gsap, ScrollTrigger, sectionAbout } from './core.js?v=20260602-operational-update';
import { initAboutDockHighlight } from './dock.js?v=20260602-operational-update';

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


export { initAboutAnimation };

