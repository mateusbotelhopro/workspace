/* ─────────────────────────────────────────────────────────────────────────────
   Tags de rastreamento (GTM, ContentSquare, Meta Pixel).
   Carregam direto, sem banner de aviso.
───────────────────────────────────────────────────────────────────────────── */
(function () {
    var GTM_ID = 'GTM-PFLSM4T8';
    var PIXEL_ID = '840015548656031';
    var CS_SRC = 'https://t.contentsquare.net/uxa/af7aa2159c920.js';
    var AW_ID = 'AW-17962154967';
    var AW_LABEL_CONTATO = 'iBaWCPH4mOAcENf3gvVC';

    // Google Tag Manager
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);

    // Google Ads (conversão: clique nos links de WhatsApp)
    (function () {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW_ID;
        document.head.appendChild(s);
    })();
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', AW_ID);
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
        link.addEventListener('click', function () {
            gtag('event', 'conversion', {
                'send_to': AW_ID + '/' + AW_LABEL_CONTATO,
                'value': 1.0,
                'currency': 'BRL'
            });
        });
    });

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
})();
