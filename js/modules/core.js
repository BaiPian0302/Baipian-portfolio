const { gsap, ScrollTrigger, Lenis } = window;

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const lenis = new Lenis({
    duration: 0.95,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
    wheelMultiplier: 1,
    smoothWheel: true,
    infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

export const CATEGORIES = [
    { id: 'operational', name: '运营设计', en: 'Operational Design' },
    { id: 'visual',      name: '视觉设计', en: 'Visual Design' },
    { id: 'motion',      name: '动效设计', en: 'Motion Design' },
    { id: 'ai',          name: 'AI设计',   en: 'AI Design' },
];

export const PROJECTS = [
    { name: '模型训练导师赛', category: 'operational', tag: 'Model Master Bootcamp', cover: 'assets/images/projects/Operational Design/slide-1-模型训练导师活动页.webp' },
    { name: '海艺绘梦师',   category: 'operational', tag: 'SeaArt Dreamweaver', cover: 'assets/images/projects/Operational Design/slide-2-海艺绘梦师.webp' },
    { name: '儿童节活动',   category: 'operational', tag: 'Back to Innocence',  cover: 'assets/images/projects/Operational Design/slide-3-儿童节活动.webp' },
    { name: '圣诞灵感季',   category: 'operational', tag: 'Winter Inspiration', cover: 'assets/images/projects/Operational Design/slide-4-圣诞活动.webp' },
    { name: '创作者激励计划', category: 'operational', tag: 'Incentive Program', cover: 'assets/images/projects/Operational Design/slide-5-激励计划.webp' },
    { name: '内容创作大赛', category: 'operational', tag: 'Creation Contest',   cover: 'assets/images/projects/Operational Design/slide-6-内容创作大赛.webp' },
    { name: '2024 年度报告', category: 'operational', tag: 'Annual Report',     cover: 'assets/images/projects/Operational Design/slide-7-2024年度报告.webp' },
    { name: 'Banner 合集',  category: 'operational', tag: 'Daily Operations',  cover: 'assets/images/projects/Operational Design/slide-8-活动banner合集.webp' },
    { name: '品牌入驻小红书', category: 'visual', tag: 'Brand Launch',       cover: 'assets/images/projects/Visual Design/slide-1 品牌入驻小红书.webp' },
    { name: 'ComfyUI 大会',  category: 'visual', tag: 'Conference',         cover: 'assets/images/projects/Visual Design/slide-2 comfyui 大会线下物料.webp' },
    { name: '产品外宣合集',  category: 'visual', tag: 'Product Promotion',  cover: 'assets/images/projects/Visual Design/slide-3-产品外宣合集.webp' },
    { name: '网站素材合集',  category: 'visual', tag: 'Web Asset Collection', cover: 'assets/images/projects/Visual Design/slide-4-网站素材合集.webp' },
    {
        name: '动效设计',
        category: 'motion',
        tag: 'Motion Design',
        type: 'bento',
        grad: 'grad-4',
        icon: '▶',
        bentoSections: [
            {
                title: 'AI 视频混剪', label: 'AI Video',
                cols: 2, ratio: '16 / 9',
                items: [
                    'AI视频-混剪.mp4',
                    'AI视频-soar2.mp4',
                    'AI视频-SeaArt Muse.mp4',
                    'AI视频-SeaArt Jump banner.mp4',
                ],
            },
            {
                title: '产品功能动效', label: 'Product Motion',
                cols: 4, ratio: '5 / 3',
                items: [
                    '动效设计-数字人-WEB - 副本.mp4',
                    '动效设计-模型训练-WEB - 副本.mp4',
                    '动效设计-社区-web - 副本.mp4',
                    '动效设计-生图-WEB - 副本.mp4',
                ],
            },
            {
                title: '视频封面包装', label: 'Video Covers',
                cols: 6, ratio: '3 / 4',
                items: [
                    '视频封面-folw入口.mp4',
                    '视频封面-GPT 2.0 EDIT-2.mp4',
                    '视频封面-gpt-34.mp4',
                    '视频封面-gpt-无.mp4',
                    '视频封面-SeaArt StarDream2.0 Fast-无.mp4',
                    '视频封面-VEO 3.1.mp4',
                ],
            },
            {
                title: '模型展示视频', label: 'Model Showcase',
                cols: 4, ratio: '3 / 4',
                items: [
                    '视频展示-20260427_1441_video.mp4',
                    '视频展示-SeaArt Ultra Edit.mp4',
                    '视频展示-SeaArt Film Video 2.0-无.mp4',
                    '视频展示-SeaArt Film Video Boost-34-无.mp4',
                    '视频展示-SeaArt Galaxy Fast-无.mp4',
                    '视频展示-SeaArt StarDream2.0 -无.mp4',
                    '视频展示-模板.mp4',
                    '视频展示-对战.mp4',
                ],
            },
            {
                title: '商业化视频', label: 'Commercial',
                cols: 2, ratio: '16 / 9', fit: 'top',
                items: [
                    '商业化-1.mp4',
                    '商业化-2.mp4',
                    '商业化-3.mp4',
                    '商业化-4.mp4',
                ],
            },
        ],
    },
];

export const MOTION = {
    fast: 0.18,
    base: 0.28,
    slow: 0.42,
    easeOut: 'power2.out',
    easeStrong: 'power3.out',
};

export const SCROLL = {
    sectionDuration: 1.5,
    projectDuration: 1.2,
    projectOffset: -100,
};

export const sectionLanding = document.getElementById('section-landing');
export const scrollHint = document.getElementById('scroll-hint');
export const gallerySection = document.getElementById('section-gallery');
export const galleryTrack = document.getElementById('gallery-track');
export const sidebarProjects = document.getElementById('sidebar-projects');
export const sidebarCounter = document.getElementById('sidebar-counter');
export const galleryNowNum = document.getElementById('gallery-now-num');
export const galleryNowName = document.getElementById('gallery-now-name');
export const sectionAbout = document.getElementById('section-about');
export const contactModal = document.getElementById('contact-modal');
export const modalCloseBtn = document.getElementById('modal-close');
export const dockWrapper = document.getElementById('dock-wrapper');
export const dock = document.getElementById('dock');
export const dockItems = document.querySelectorAll('.dock-item');
export const dockIcons = document.querySelectorAll('.dock-icon');

export function formatIndex(n) {
    return String(n).padStart(2, '0');
}

export function createRafThrottled(fn) {
    let queued = false;
    let lastArgs = [];
    return (...args) => {
        lastArgs = args;
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fn(...lastArgs);
        });
    };
}

export function scrollToSection(target, duration = SCROLL.sectionDuration) {
    if (!target) return;
    lenis.scrollTo(target, { duration });
}

export function scrollToTop() {
    lenis.scrollTo(0, { duration: SCROLL.sectionDuration });
}



