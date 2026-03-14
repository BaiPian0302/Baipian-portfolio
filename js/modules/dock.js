import {
    ScrollTrigger,
    sectionAbout,
    gallerySection,
    dockItems,
    scrollToSection,
    scrollToTop,
} from './core.js';

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

export function initGalleryNowPill() {
    if (!gallerySection) return;
    const pill = document.getElementById('gallery-now');
    if (!pill) return;

    ScrollTrigger.create({
        trigger: gallerySection,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => pill.classList.add('visible'),
        onLeaveBack: () => pill.classList.remove('visible'),
        onLeave: () => pill.classList.remove('visible'),
        onEnterBack: () => pill.classList.add('visible'),
    });
}

export function initDockInteractions() {
    document.getElementById('dock-brand')?.addEventListener('click', () => {
        setActiveDock('home');
        scrollToTop();
    });

    dockItems.forEach((item) => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            dockActionMap[action]?.();
        });
    });
}
