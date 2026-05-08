import { initLanding } from './landing.js?v=20260508-structure-fix';
import { initVisualEffects } from './effects.js?v=20260508-structure-fix';
import { initMarquee } from './marquee.js?v=20260508-structure-fix';
import { initGlobalEvents } from './global-events.js?v=20260508-structure-fix';
export { initContactModal } from './contact.js?v=20260508-structure-fix';

export function initAfterLoad() {
    initLanding();
    initVisualEffects();
    initMarquee();
    initGlobalEvents();
}

