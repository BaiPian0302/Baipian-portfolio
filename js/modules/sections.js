import { initLanding } from './landing.js?v=20260602-operational-update';
import { initVisualEffects } from './effects.js?v=20260602-operational-update';
import { initMarquee } from './marquee.js?v=20260602-operational-update';
import { initGlobalEvents } from './global-events.js?v=20260602-operational-update';
export { initContactModal } from './contact.js?v=20260602-operational-update';

export function initAfterLoad() {
    initLanding();
    initVisualEffects();
    initMarquee();
    initGlobalEvents();
}
