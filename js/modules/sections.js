import { initLanding } from './landing.js?v=20260602-motion-last';
import { initVisualEffects } from './effects.js?v=20260602-motion-last';
import { initMarquee } from './marquee.js?v=20260602-motion-last';
import { initGlobalEvents } from './global-events.js?v=20260602-motion-last';
export { initContactModal } from './contact.js?v=20260602-motion-last';

export function initAfterLoad() {
    initLanding();
    initVisualEffects();
    initMarquee();
    initGlobalEvents();
}
