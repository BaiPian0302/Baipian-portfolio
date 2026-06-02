import { initLanding } from './landing.js?v=20260602-sidebar-order-fix';
import { initVisualEffects } from './effects.js?v=20260602-sidebar-order-fix';
import { initMarquee } from './marquee.js?v=20260602-sidebar-order-fix';
import { initGlobalEvents } from './global-events.js?v=20260602-sidebar-order-fix';
export { initContactModal } from './contact.js?v=20260602-sidebar-order-fix';

export function initAfterLoad() {
    initLanding();
    initVisualEffects();
    initMarquee();
    initGlobalEvents();
}
