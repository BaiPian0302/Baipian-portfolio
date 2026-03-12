import {
    gsap,
    ScrollTrigger,
    MOTION,
    sectionAbout,
    gallerySection,
    dock,
    dockItems,
    dockIcons,
    scrollToSection,
    scrollToTop,
} from './core.js';

const DOCK_BASE = 50;
const DOCK_MAG = 70;
const DOCK_DIST = 180;
const DOCK_PANEL_H = 68;

let dockIconCenters = [];

const iconSprings = [];
dockIcons.forEach((icon) => {
    gsap.set(icon, { width: DOCK_BASE, height: DOCK_BASE });
    iconSprings.push({
        w: gsap.quickTo(icon, 'width', { duration: 0.25, ease: 'power3.out' }),
        h: gsap.quickTo(icon, 'height', { duration: 0.25, ease: 'power3.out' }),
    });
});

const dockPanelSpring = gsap.quickTo(dock, 'height', { duration: 0.3, ease: 'power3.out' });
const dockMaxH = Math.max(DOCK_PANEL_H, DOCK_MAG + DOCK_MAG / 2 + 4);

const dockActionMap = {
    home: () => scrollToTop(),
    works: () => scrollToSection(gallerySection),
    about: () => scrollToSection(sectionAbout),
    contact: () => window.__openContactModal?.(),
    resume: () => {
        const url = 'assets/files/resume.pdf';
        fetch(url, { method: 'HEAD' }).then(r => {
            if (r.ok) window.open(url, '_blank');
            else alert('简历正在准备中，请稍后再试 :)');
        }).catch(() => alert('简历正在准备中，请稍后再试 :)'));
    },
};

export function updateDockMetrics() {
    dockIconCenters = Array.from(dockIcons, (icon) => {
        const rect = icon.getBoundingClientRect();
        return rect.left + rect.width / 2 + window.scrollX;
    });
}

export function setActiveDock(action) {
    dockItems.forEach((item) => item.classList.toggle('active', item.dataset.action === action));
}

export function initAboutDockHighlight() {
    if (!sectionAbout) return;

    ScrollTrigger.create({
        trigger: sectionAbout,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveDock('about'),
        onLeaveBack: () => setActiveDock('home'),
        onLeave: () => setActiveDock('works'),
    });
}

export function initDockInteractions() {
    dock.addEventListener('mouseenter', updateDockMetrics, { passive: true });

    dock.addEventListener('mousemove', (e) => {
        if (!dockIconCenters.length) updateDockMetrics();

        dockPanelSpring(dockMaxH);

        dockIcons.forEach((icon, index) => {
            const distance = Math.abs(e.pageX - dockIconCenters[index]);
            const size = distance >= DOCK_DIST
                ? DOCK_BASE
                : DOCK_BASE + (DOCK_MAG - DOCK_BASE) * (1 - distance / DOCK_DIST);

            iconSprings[index].w(size);
            iconSprings[index].h(size);
        });
    }, { passive: true });

    dock.addEventListener('mouseleave', () => {
        dockPanelSpring(DOCK_PANEL_H);
        dockIcons.forEach((_, index) => {
            iconSprings[index].w(DOCK_BASE);
            iconSprings[index].h(DOCK_BASE);
        });
    });

    dockItems.forEach((item) => {
        const tooltip = item.querySelector('.dock-tooltip');

        item.addEventListener('mouseenter', () => {
            gsap.killTweensOf(tooltip);
            gsap.to(tooltip, { opacity: 1, y: -6, duration: MOTION.fast, ease: MOTION.easeOut });
        });

        item.addEventListener('mouseleave', () => {
            gsap.killTweensOf(tooltip);
            gsap.to(tooltip, { opacity: 0, y: 0, duration: 0.14, ease: 'power2.in' });
        });

        item.addEventListener('click', () => {
            const action = item.dataset.action;
            const icon = item.querySelector('.dock-icon');

            gsap.to(icon, {
                y: -7,
                duration: MOTION.fast,
                ease: MOTION.easeOut,
                onComplete: () => gsap.to(icon, { y: 0, duration: 0.38, ease: 'back.out(2.2)' }),
            });

            dockActionMap[action]?.();
        });
    });
}
