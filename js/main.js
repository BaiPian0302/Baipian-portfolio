import { initGalleryOnDemand, setGalleryDockHandler } from './modules/gallery.js?v=20260508-motion-first';
import { initDockInteractions, setActiveDock } from './modules/dock.js?v=20260508-motion-first';
import { initAfterLoad, initContactModal } from './modules/sections.js?v=20260508-motion-first';

setGalleryDockHandler(setActiveDock);
initGalleryOnDemand();
initDockInteractions();
initContactModal();

window.addEventListener('load', () => {
    setTimeout(initAfterLoad, 100);
});
