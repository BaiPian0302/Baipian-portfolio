import { lenis, contactModal, modalCloseBtn } from './core.js?v=20260602-motion-last';

export function initContactModal() {
    if (!contactModal) return;

    let previousFocus = null;
    const focusableSelector = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

    const trapFocus = (e) => {
        if (e.key !== 'Tab') return;
        const focusable = contactModal.querySelectorAll(focusableSelector);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const openModal = () => {
        previousFocus = document.activeElement;
        contactModal.classList.add('active');
        lenis.stop();
        contactModal.addEventListener('keydown', trapFocus);
        requestAnimationFrame(() => modalCloseBtn?.focus());
    };

    const closeModal = () => {
        contactModal.classList.remove('active');
        contactModal.removeEventListener('keydown', trapFocus);
        lenis.start();
        previousFocus?.focus();
    };

    modalCloseBtn?.addEventListener('click', closeModal);
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    const copyButton = contactModal.querySelector('.copy-wechat');
    if (copyButton) {
        const showCopied = () => {
            const hint = copyButton.querySelector('.copy-hint');
            if (hint) hint.textContent = '已复制!';
            copyButton.classList.add('copied');
            setTimeout(() => {
                if (hint) hint.textContent = '点击复制';
                copyButton.classList.remove('copied');
            }, 2000);
        };

        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const text = copyButton.dataset.wechat;
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(text).then(showCopied).catch(() => fallbackCopy(text));
            } else {
                fallbackCopy(text);
            }
        });
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showCopied(); } catch { /* silent */ }
        ta.remove();

        function showCopied() {
            const hint = copyButton?.querySelector('.copy-hint');
            if (hint) hint.textContent = '已复制!';
            copyButton?.classList.add('copied');
            setTimeout(() => {
                if (hint) hint.textContent = '点击复制';
                copyButton?.classList.remove('copied');
            }, 2000);
        }
    }

    window.__openContactModal = openModal;
    window.__closeContactModal = closeModal;
}


