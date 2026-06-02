import { initGalleryOnDemand, setGalleryDockHandler } from './modules/gallery.js?v=20260602-operational-update';
import { initDockInteractions, setActiveDock } from './modules/dock.js?v=20260602-operational-update';
import { initAfterLoad, initContactModal } from './modules/sections.js?v=20260602-operational-update';

setGalleryDockHandler(setActiveDock);
initGalleryOnDemand();
initDockInteractions();
initContactModal();

window.addEventListener('load', () => {
    setTimeout(initAfterLoad, 100);
});
