/* ─────────────────────────────────────────────────────────────────────────────
   Gerenciador de consentimento de cookies (LGPD opt-in)
   As tags de rastreamento (GTM, ContentSquare, Meta Pixel) SÓ carregam após o
   aceite. Sem escolha = banner aparece. Recusa = nada é carregado.
   Escolha guardada em localStorage por 6 meses.
───────────────────────────────────────────────────────────────────────────── */
(function () {
    var KEY = 'mb_cookie_consent';
    var MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180; // 180 dias
    var GTM_ID = 'GTM-PFLSM4T8';
    var PIXEL_ID = '840015548656031';
    var CS_SRC = 'https://t.contentsquare.net/uxa/af7aa2159c920.js';

    function getChoice() {
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            if (!data || (Date.now() - data.t) > MAX_AGE_MS) return null;
            return data.v; // 'accepted' | 'rejected'
        } catch (e) { return null; }
    }

    function setChoice(v) {
        try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
    }

    function loadTracking() {
        // Google Tag Manager
        (function (w, d, s, l, i) {
            w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', GTM_ID);

        // Meta Pixel
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', PIXEL_ID);
        fbq('track', 'PageView');

        // ContentSquare
        var cs = document.createElement('script');
        cs.src = CS_SRC; cs.defer = true;
        document.head.appendChild(cs);
    }

    function removeBanner() {
        var b = document.getElementById('cookie-consent');
        if (b) b.parentNode.removeChild(b);
        document.body.classList.remove('cc-banner-open');
    }

    function accept() { setChoice('accepted'); removeBanner(); loadTracking(); }
    function reject() { setChoice('rejected'); removeBanner(); }

    function showBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-consent';
        banner.className = 'cookie-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Aviso de cookies');
        banner.innerHTML =
            '<div class="cookie-consent__inner">' +
                '<p class="cookie-consent__text">Usamos cookies de analytics e marketing para medir audiência e a performance das campanhas. Você escolhe. Detalhes na <a href="cookies.html">Política de Cookies</a>.</p>' +
                '<div class="cookie-consent__actions">' +
                    '<button type="button" class="cookie-consent__btn cookie-consent__btn--ghost" data-cc-reject>Recusar</button>' +
                    '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-cc-accept>Aceitar</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(banner);
        document.body.classList.add('cc-banner-open');
        var acceptBtn = banner.querySelector('[data-cc-accept]');
        acceptBtn.addEventListener('click', accept);
        banner.querySelector('[data-cc-reject]').addEventListener('click', reject);
        acceptBtn.focus();
    }

    var choice = getChoice();
    if (choice === 'accepted') { loadTracking(); return; }
    if (choice === 'rejected') { return; }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
    } else {
        showBanner();
    }
})();
