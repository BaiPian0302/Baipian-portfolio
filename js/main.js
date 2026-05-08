import { initGalleryOnDemand, setGalleryDockHandler } from './modules/gallery.js?v=20260508-structure-fix';
import { initDockInteractions, setActiveDock } from './modules/dock.js?v=20260508-structure-fix';
import { initAfterLoad, initContactModal } from './modules/sections.js?v=20260508-structure-fix';

setGalleryDockHandler(setActiveDock);
initGalleryOnDemand();
initDockInteractions();
initContactModal();

window.addEventListener('load', () => {
    setTimeout(initAfterLoad, 100);
});


