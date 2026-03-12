import { initGalleryOnDemand, setGalleryDockHandler } from './modules/gallery.js';
import { initDockInteractions, setActiveDock } from './modules/dock.js';
import { initAfterLoad, initContactModal } from './modules/sections.js';

setGalleryDockHandler(setActiveDock);
initGalleryOnDemand();
initDockInteractions();
initContactModal();

window.addEventListener('load', () => {
    setTimeout(initAfterLoad, 100);
});
