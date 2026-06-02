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
} from './core.js?v=20260602-operational-update';

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
let refreshTimer = 0;

function ensureGalleryArticles() {
    if (!galleryArticles.length) {
        galleryArticles = Array.from(galleryTrack.querySelectorAll('.project-article'));
    }
}

function getCategoryProgress(pi) {
    const project = PROJECTS[pi];
    if (!project) return { current: pi + 1, total: PROJECTS.length };

    const categoryProjects = PROJECTS
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.category === project.category);

    return {
        current: categoryProjects.findIndex((item) => item.index === pi) + 1,
        total: categoryProjects.length,
    };
}

const GUIDE_IMAGES = {
    operational: 'assets/images/Guide/1.Operational.webp?v=20260602-operational-update',
    visual:      'assets/images/Guide/2.Visual.webp?v=20260602-operational-update',
    motion:      'assets/images/Guide/3.Motion.webp?v=20260602-operational-update',
    ai:          'assets/images/Guide/4.AI.webp?v=20260602-operational-update',
};

function renderGuide(src, label, id) {
    const idAttr = id ? ` id="${id}"` : '';
    return `<div class="gallery-guide"${idAttr}><img src="${src}" alt="${label}" loading="lazy" draggable="false"></div>`;
}

function renderInteractiveGrid(projects) {
    const cards = projects.map((p) => {
        const coverImg = p.cover
            ? `<img src="${p.cover}" alt="${p.name}" loading="lazy" draggable="false">`
            : '';
        return `<a class="interactive-card" href="${p.href}" target="_blank" rel="noopener">
            <div class="interactive-cover">${coverImg}</div>
            <div class="interactive-body">
                <div class="interactive-header">
                    <h3 class="interactive-name">${p.name}</h3>
                    <span class="interactive-tag">${p.tag}</span>
                </div>
                <p class="interactive-desc">${p.desc}</p>
                <span class="interactive-cta">↗</span>
            </div>
        </a>`;
    }).join('');

    return `<div class="interactive-grid">${cards}</div>`;
}

function renderProjectArticle(project, pi) {
    if (project.type === 'bento') return renderBentoArticle(project, pi);
    if (project.type === 'interactive') return null;

    return `<article class="project-article" data-pi="${pi}" id="project-${pi}">
        <div class="project-hero">
            <img src="${project.cover}" alt="${project.name}" loading="lazy" draggable="false">
        </div>
    </article>`;
}

function renderBentoArticle(project, pi) {
    const base = 'assets/images/projects/motion-design/';
    const sectionsHtml = (project.bentoSections || []).map((section, sectionIndex) => {
        const extraClass = section.fit ? ` bento-fit-${section.fit}` : '';
        const cellsHtml = section.items
            .map((filename) => `<div class="bento-cell"><video data-src="${base}${filename}" muted loop playsinline preload="none"></video></div>`)
            .join('');
        const sectionTitle = section.title
            ? `<div class="bento-section-heading" id="motion-section-${sectionIndex}">
                <span class="bento-section-kicker">${section.label || `Motion ${formatIndex(sectionIndex + 1)}`}</span>
                <h3>${section.title}</h3>
            </div>`
            : '';
        return `${sectionTitle}<div class="bento-section${extraClass}" style="--bento-cols:${section.cols}; --cell-ratio:${section.ratio}">${cellsHtml}</div>`;
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

function scrollSidebarToActive() {
    const activeElement = sidebarProjects.querySelector('.sc-project.active');
    if (!activeElement) return;

    const inner = activeElement.closest('.sc-body-inner');
    if (!inner) return;

    const elTop = activeElement.offsetTop - inner.offsetTop;
    const target = elTop - inner.clientHeight / 2 + activeElement.offsetHeight / 2;
    inner.scrollTo({ top: target, behavior: 'smooth' });
}

function updateSidebarProjectHighlight(pi) {
    const project = PROJECTS[pi];
    const catChanged = project.category !== expandedCatId;

    sidebarProjects.querySelectorAll('.sc-project').forEach((element) => {
        element.classList.toggle('active', parseInt(element.dataset.pi, 10) === pi);
    });

    if (catChanged) {
        expandCategory(project.category);
        setTimeout(scrollSidebarToActive, 450);
    } else {
        requestAnimationFrame(scrollSidebarToActive);
    }
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

            const progress = getCategoryProgress(project.pi);

            const motionSections = project.type === 'bento'
                ? `<div class="sc-subnav">
                    ${(project.bentoSections || []).map((section, sectionIndex) => `
                        <button class="sc-subitem" type="button" data-motion-section="${sectionIndex}">
                            <span>${formatIndex(sectionIndex + 1)}</span>${section.title || section.label || `Section ${sectionIndex + 1}`}
                        </button>
                    `).join('')}
                </div>`
                : '';

            return `<div class="sc-project" data-pi="${project.pi}">
                <div class="sc-cover"><span class="sc-num">${formatIndex(progress.current)}</span>${coverImg}</div>
                <div class="sc-meta">
                    <span class="sc-title">${project.name}</span>
                    <span class="sc-tag">${project.tag}</span>
                </div>
            </div>${motionSections}`;
        }).join('');

        const emptyHint = projects.length === 0 ? '<div class="sc-empty"><span class="sc-empty-icon">✦</span>即将更新</div>' : '';

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

    sidebarProjects.querySelectorAll('.sc-subitem').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            buildGallery();
            initGalleryScroll();
            const target = document.getElementById(`motion-section-${item.dataset.motionSection}`);
            if (target) lenis.scrollTo(target, { offset: SCROLL.projectOffset, duration: SCROLL.projectDuration });
        });
    });

    sidebarProjects.querySelectorAll('.sc-cover img').forEach((img) => {
        const onLoad = () => { img.classList.add('loaded'); img.closest('.sc-cover')?.classList.add('media-loaded'); };
        if (img.complete) { onLoad(); return; }
        img.addEventListener('load', onLoad, { once: true });
    });

    expandCategory(PROJECTS[0].category);
    updateSidebarProjectHighlight(0);
    const initialProgress = getCategoryProgress(0);
    sidebarCounter.textContent = `01 / ${formatIndex(initialProgress.total)}`;
}

function updateGalleryOverlay(pi) {
    const project = PROJECTS[pi];
    if (!project) return;

    activePi = pi;
    const num = formatIndex(pi + 1);

    const progress = getCategoryProgress(pi);
    const categoryProgress = `${formatIndex(progress.current)} / ${formatIndex(progress.total)}`;

    sidebarCounter.textContent = categoryProgress;
    if (galleryNowNum) galleryNowNum.textContent = categoryProgress;
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

function markLoaded(el, shouldRefresh = true) {
    el.classList.add('loaded');
    el.parentElement?.classList.add('media-loaded');
    if (!shouldRefresh) return;

    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}

function loadVideo(video) {
    if (!video || video.dataset.loaded === 'true') return;
    video.src = video.dataset.src;
    video.dataset.loaded = 'true';
    video.addEventListener('loadeddata', () => markLoaded(video, false), { once: true });
    video.load();
}

function playVideo(video) {
    if (!video) return;
    loadVideo(video);
    const playPromise = video.play?.();
    if (playPromise?.catch) playPromise.catch(() => {});
}

function pauseVideo(video) {
    if (!video || video.paused) return;
    video.pause();
}

function observeBentoVideos() {
    if (videoObserver || !galleryBuilt) return;

    const bentoVideos = galleryTrack.querySelectorAll('.bento-section video[data-src]');
    if (!bentoVideos.length) return;

    if (!('IntersectionObserver' in window)) {
        bentoVideos.forEach(playVideo);
        return;
    }

    videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                playVideo(entry.target);
            } else {
                pauseVideo(entry.target);
            }
        });
    }, { rootMargin: '80px 0px', threshold: 0.18 });

    bentoVideos.forEach((video) => videoObserver.observe(video));
}

export function setGalleryDockHandler(handler) {
    onGalleryActive = handler ?? (() => {});
}

export function buildGallery() {
    if (galleryBuilt) return;

    let lastCategory = null;
    const interactiveProjects = [];
    const parts = [];

    PROJECTS.forEach((project, pi) => {
        if (project.category !== lastCategory) {
            const guideSrc = GUIDE_IMAGES[project.category];
            if (guideSrc) parts.push(renderGuide(guideSrc, project.category, `guide-${project.category}`));
            lastCategory = project.category;
        }
        if (project.type === 'interactive') {
            interactiveProjects.push(project);
            parts.push(`<article class="project-article" data-pi="${pi}" id="project-${pi}" style="display:none"></article>`);
            return;
        }
        parts.push(renderProjectArticle(project, pi));
    });

    if (interactiveProjects.length) {
        parts.push(renderInteractiveGrid(interactiveProjects));
    }

    galleryTrack.innerHTML = parts.join('');
    galleryArticles = Array.from(galleryTrack.querySelectorAll('.project-article'));
    galleryBuilt = true;

    galleryTrack.querySelectorAll('.project-hero img, .gallery-guide img').forEach((img) => {
        if (img.complete) { markLoaded(img); return; }
        img.addEventListener('load', () => markLoaded(img), { once: true });
    });

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

    galleryArticles.forEach((article) => {
        const pi = parseInt(article.dataset.pi, 10);

        const articleTrigger = ScrollTrigger.create({
            trigger: article,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => updateGalleryOverlay(pi),
            onEnterBack: () => updateGalleryOverlay(pi),
        });

        galleryArticleTriggers.push(articleTrigger);

        const leadElement = article.querySelector('.project-hero, .project-bento-layout');
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

    let target = document.getElementById(`project-${pi}`);
    if (!target) return;

    updateSidebarProjectHighlight(pi);

    if (target.style.display === 'none') {
        const project = PROJECTS[pi];
        target = document.getElementById(`guide-${project?.category}`)
              || galleryTrack.querySelector('.interactive-grid')
              || target;
    }

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


