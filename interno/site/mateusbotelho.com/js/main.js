// Helper: dispara fbq só se o pixel estiver carregado
function pixel(event, params) {
    if (typeof fbq !== 'undefined') fbq('track', event, params || {});
}

// ─── Navbar scroll ────────────────────────────────────────────────────────────
const mainNav = document.getElementById('main-nav');
if (mainNav) {
    window.addEventListener('scroll', () => {
        mainNav.classList.toggle('nav-scrolled', window.scrollY > 40);
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {

    // ─── META PIXEL EVENTS ────────────────────────────────────────────────────

    // 1. Contact — qualquer clique em botão WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => pixel('Contact'));
    });

    // 2. InitiateCheckout — CTA principal do hero (sinal de alta intenção)
    const heroCta = document.getElementById('cta-hero');
    if (heroCta) {
        heroCta.addEventListener('click', () => pixel('InitiateCheckout'));
    }

    // 3. ViewContent — seções estratégicas ao entrarem na viewport
    const sectionsToTrack = [
        { id: 'virada',  name: 'A Virada'  },
        { id: 'quem-cuida', name: 'Bio' },
        { id: 'resultados', name: 'Resultados' },
        { id: 'pra-quem', name: 'Pra Quem É' },
        { id: 'pacote',  name: 'O Pacote'  },
        { id: 'objecao', name: 'Objeção'   },
        { id: 'faq',     name: 'FAQ'       },
    ];

    const viewedSections = new Set();
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !viewedSections.has(entry.target.id)) {
                viewedSections.add(entry.target.id);
                const name = entry.target.dataset.trackName;
                pixel('ViewContent', { content_name: name, content_type: 'section' });
            }
        });
    }, { threshold: 0.35 });

    sectionsToTrack.forEach(({ id, name }) => {
        const el = document.getElementById(id);
        if (el) {
            el.dataset.trackName = name;
            sectionObserver.observe(el);
        }
    });

});
