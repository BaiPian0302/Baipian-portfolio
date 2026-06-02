import { initGalleryOnDemand, setGalleryDockHandler } from './modules/gallery.js?v=20260602-sidebar-order-fix';
import { initDockInteractions, setActiveDock } from './modules/dock.js?v=20260602-sidebar-order-fix';
import { initAfterLoad, initContactModal } from './modules/sections.js?v=20260602-sidebar-order-fix';

setGalleryDockHandler(setActiveDock);
initGalleryOnDemand();
initDockInteractions();
initContactModal();

window.addEventListener('load', () => {
    setTimeout(initAfterLoad, 100);
});
