import { lenis } from './modules/core.js';
import { initGalleryOnDemand, setGalleryDockHandler } from './modules/gallery.js';
import { initDockInteractions, setActiveDock } from './modules/dock.js';
import { initAfterLoad, initContactModal } from './modules/sections.js';

document.documentElement.scrollTop = 0;
lenis.scrollTo(0, { immediate: true, force: true });

setGalleryDockHandler(setActiveDock);
initGalleryOnDemand();
initDockInteractions();
initContactModal();

document.fonts.ready.then(() => {
    document.documentElement.scrollTop = 0;
    lenis.scrollTo(0, { immediate: true, force: true });
    requestAnimationFrame(initAfterLoad);
});
