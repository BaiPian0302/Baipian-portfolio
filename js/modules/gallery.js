import {
    gsap,
    ScrollTrigger,
    lenis,
    CATEGORIES,
    PROJECTS,
    MOTION,
    SCROLL,
    gallerySection,
    galleryTrack,
    sidebarProjects,
    sidebarCounter,
    galleryNowNum,
    galleryNowName,
    formatIndex,
} from './core.js';

let activePi = 0;
let expandedCatId = null;
let galleryArticleTriggers = [];
let galleryRevealTriggers = [];
let gallerySectionTrigger = null;
let galleryArticles = [];
let galleryBuilt = false;
let galleryScrollReady = false;
let videoObserver = null;
let onGalleryActive = () => {};

function ensureGalleryArticles() {
    if (!galleryArticles.length) {
        galleryArticles = Array.from(galleryTrack.querySelectorAll('.project-article'));
    }
}

function renderProjectArticle(project, pi) {
    if (project.type === 'bento') return renderBentoArticle(project, pi);

    return `<article class="project-article" data-pi="${pi}" id="project-${pi}">
        <div class="project-hero">
            <img src="${project.cover}" alt="${project.name}" loading="lazy" draggable="false">
        </div>
    </article>`;
}

function renderBentoArticle(project, pi) {
    const base = 'assets/images/projects/motion-design/';
    const sectionsHtml = (project.bentoSections || []).map((section) => {
        const extraClass = section.fit ? ` bento-fit-${section.fit}` : '';
        const cellsHtml = section.items
            .map((filename) => `<div class="bento-cell"><video data-src="${base}${filename}" muted loop playsinline preload="none"></video></div>`)
            .join('');
        return `<div class="bento-section${extraClass}" style="--bento-cols:${section.cols}; --cell-ratio:${section.ratio}">${cellsHtml}</div>`;
    }).join('');

    return `<article class="project-article" data-pi="${pi}" id="project-${pi}">
        <div class="project-bento-layout">${sectionsHtml}</div>
    </article>`;
}

function collapseAllCategories() {
    expandedCatId = null;
    sidebarProjects.querySelectorAll('.sidebar-category').forEach((element) => {
        element.classList.remove('expanded');
        element.querySelector('.sc-body').style.maxHeight = '0';
    });
}

function expandCategory(catId) {
    expandedCatId = catId;
    sidebarProjects.querySelectorAll('.sidebar-category').forEach((element) => {
        const isTarget = element.dataset.cat === catId;
        element.classList.toggle('expanded', isTarget);

        const body = element.querySelector('.sc-body');
        const inner = body.querySelector('.sc-body-inner');
        body.style.maxHeight = isTarget ? `${inner.offsetHeight}px` : '0';
    });
}

function toggleCategory(catId) {
    if (expandedCatId === catId) {
        collapseAllCategories();
        return;
    }

    expandCategory(catId);
}

function updateSidebarProjectHighlight(pi) {
    const project = PROJECTS[pi];

    sidebarProjects.querySelectorAll('.sc-project').forEach((element) => {
        element.classList.toggle('active', parseInt(element.dataset.pi, 10) === pi);
    });

    if (project.category !== expandedCatId) {
        expandCategory(project.category);
    }

    requestAnimationFrame(() => {
        const activeElement = sidebarProjects.querySelector('.sc-project.active');
        if (!activeElement) return;

        const inner = activeElement.closest('.sc-body-inner');
        if (!inner) return;

        const elTop = activeElement.offsetTop - inner.offsetTop;
        const target = elTop - inner.clientHeight / 2 + activeElement.offsetHeight / 2;
        inner.scrollTo({ top: target, behavior: 'smooth' });
    });
}

function buildSidebarProjects() {
    const arrowSvg = `<svg class="sc-arrow" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1"/>
        <path d="M9.5 7L13.5 11L9.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    sidebarProjects.innerHTML = CATEGORIES.map((category) => {
        const projects = PROJECTS
            .map((project, pi) => ({ ...project, pi }))
            .filter((project) => project.category === category.id);

        const projectsHtml = projects.map((project) => {
            const coverImg = project.cover
                ? `<img src="${project.cover}" alt="${project.name}" loading="eager" decoding="async">`
                : `<div class="sc-cover-fallback ${project.grad || 'grad-4'}"><span>${project.icon || '●'}</span></div>`;

            return `<div class="sc-project" data-pi="${project.pi}">
                <div class="sc-cover"><span class="sc-num">${formatIndex(project.pi + 1)}</span>${coverImg}</div>
                <span class="sc-title">${project.name}</span>
            </div>`;
        }).join('');

        const emptyHint = projects.length === 0 ? '<div class="sc-empty">即将更新</div>' : '';

        return `<div class="sidebar-category" data-cat="${category.id}">
            <div class="sc-header">
                <div class="sc-name-group">
                    <span class="sc-name-en">${category.en}</span>
                    <span class="sc-name-cn">●${category.name}</span>
                </div>
                ${arrowSvg}
            </div>
            <div class="sc-body"><div class="sc-body-inner" data-lenis-prevent>${projectsHtml}${emptyHint}</div></div>
        </div>`;
    }).join('');

    sidebarProjects.querySelectorAll('.sc-header').forEach((header) => {
        header.addEventListener('click', () => {
            const category = header.closest('.sidebar-category');
            toggleCategory(category.dataset.cat);
        });
    });

    sidebarProjects.querySelectorAll('.sc-project').forEach((item) => {
        item.addEventListener('click', () => {
            switchProject(parseInt(item.dataset.pi, 10));
        });
    });

    expandCategory(PROJECTS[0].category);
    updateSidebarProjectHighlight(0);
    sidebarCounter.textContent = `01 / ${formatIndex(PROJECTS.length)}`;
}

function updateGalleryOverlay(pi) {
    const project = PROJECTS[pi];
    if (!project) return;

    activePi = pi;
    const num = formatIndex(pi + 1);

    sidebarCounter.textContent = `${num} / ${formatIndex(PROJECTS.length)}`;
    if (galleryNowNum) galleryNowNum.textContent = num;
    if (galleryNowName) galleryNowName.textContent = project.name;

    onGalleryActive('works');
    updateSidebarProjectHighlight(pi);
}

function killGalleryScroll() {
    galleryArticleTriggers.forEach((trigger) => trigger.kill());
    galleryRevealTriggers.forEach((trigger) => trigger.kill());
    galleryArticleTriggers = [];
    galleryRevealTriggers = [];
    gallerySectionTrigger?.kill();
    gallerySectionTrigger = null;
    galleryScrollReady = false;
}

function hydrateVideo(video) {
    if (!video || video.dataset.loaded === 'true') return;
    video.src = video.dataset.src;
    video.dataset.loaded = 'true';
    video.load();
    const playPromise = video.play?.();
    if (playPromise?.catch) playPromise.catch(() => {});
}

function observeBentoVideos() {
    if (videoObserver || !galleryBuilt) return;

    const bentoVideos = galleryTrack.querySelectorAll('.bento-section video[data-src]');
    if (!bentoVideos.length) return;

    if (!('IntersectionObserver' in window)) {
        bentoVideos.forEach(hydrateVideo);
        return;
    }

    videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            hydrateVideo(entry.target);
            videoObserver.unobserve(entry.target);
        });
    }, { rootMargin: '300px 0px', threshold: 0.01 });

    bentoVideos.forEach((video) => videoObserver.observe(video));
}

export function setGalleryDockHandler(handler) {
    onGalleryActive = handler ?? (() => {});
}

export function buildGallery() {
    if (galleryBuilt) return;

    galleryTrack.innerHTML = PROJECTS.map((project, pi) => renderProjectArticle(project, pi)).join('');
    galleryArticles = Array.from(galleryTrack.querySelectorAll('.project-article'));
    galleryBuilt = true;
    updateGalleryOverlay(0);
    buildSidebarProjects();
    observeBentoVideos();
}

export function initGalleryScroll() {
    if (galleryScrollReady) return;

    buildGallery();
    killGalleryScroll();
    ensureGalleryArticles();
    observeBentoVideos();
    galleryScrollReady = true;

    gallerySectionTrigger = ScrollTrigger.create({
        trigger: gallerySection,
        start: 'top 65%',
        end: 'bottom bottom',
        onEnter: () => onGalleryActive('works'),
        onEnterBack: () => onGalleryActive('works'),
    });

    galleryArticles.forEach((article, pi) => {
        const articleTrigger = ScrollTrigger.create({
            trigger: article,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
                if (self.isActive) updateGalleryOverlay(pi);
            },
        });

        galleryArticleTriggers.push(articleTrigger);

        const leadElement = article.querySelector('.project-hero, .project-bento-grid');
        if (!leadElement) return;

        const leadReveal = gsap.fromTo(leadElement,
            { opacity: 0, y: 32, scale: 0.985 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.72,
                ease: MOTION.easeOut,
                scrollTrigger: { trigger: article, start: 'top 72%' },
            }
        );

        if (leadReveal.scrollTrigger) {
            galleryRevealTriggers.push(leadReveal.scrollTrigger);
        }
    });
}

export function switchProject(pi) {
    buildGallery();
    initGalleryScroll();

    const target = document.getElementById(`project-${pi}`);
    if (!target) return;

    updateSidebarProjectHighlight(pi);
    lenis.scrollTo(target, { offset: SCROLL.projectOffset, duration: SCROLL.projectDuration });
}

export function initGalleryOnDemand() {
    if (!gallerySection || galleryBuilt) {
        buildGallery();
        return;
    }

    if (!('IntersectionObserver' in window)) {
        buildGallery();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            buildGallery();
            observer.disconnect();
        });
    }, { rootMargin: '120px 0px', threshold: 0 });

    observer.observe(gallerySection);
}
