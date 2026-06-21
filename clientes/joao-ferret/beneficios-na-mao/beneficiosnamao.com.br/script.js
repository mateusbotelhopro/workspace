document.addEventListener('DOMContentLoaded', () => {
    const yearTarget = document.querySelector('#current-year');
    if (yearTarget) {
        yearTarget.textContent = new Date().getFullYear();
    }

    // Reveal on scroll
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            revealItems.forEach((item) => item.classList.add('visible'));
        } else {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    });
                },
                { threshold: 0.14, rootMargin: '0px 0px -32px 0px' }
            );
            revealItems.forEach((item) => observer.observe(item));
        }
    }

    // Navbar scroll shadow
    const nav = document.getElementById('site-nav');
    if (nav) {
        const onScroll = () => {
            nav.classList.toggle('scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Exit-intent popup
    const exitPopup = document.getElementById('exit-popup');
    if (exitPopup) {
        const closePopup = () => {
            exitPopup.hidden = true;
            sessionStorage.setItem('exitPopupSeen', '1');
        };

        const showPopup = () => {
            if (sessionStorage.getItem('exitPopupSeen')) return;
            exitPopup.hidden = false;
            sessionStorage.setItem('exitPopupSeen', '1');
        };

        document.getElementById('exit-popup-close').addEventListener('click', closePopup);
        document.getElementById('exit-popup-dismiss').addEventListener('click', closePopup);
        document.getElementById('exit-popup-backdrop').addEventListener('click', closePopup);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !exitPopup.hidden) closePopup();
        });

        // Desktop: mouse leaves toward the top of the page
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) showPopup();
        });

        // Mobile: user scrolls back up significantly after scrolling down
        let maxScrollY = 0;
        let mobileTriggered = false;
        window.addEventListener('scroll', () => {
            if (window.scrollY > maxScrollY) maxScrollY = window.scrollY;
            if (!mobileTriggered && maxScrollY > 400 && window.scrollY < maxScrollY - 200) {
                mobileTriggered = true;
                showPopup();
            }
        }, { passive: true });
    }

    // Hamburger menu
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
        });

        // Close menu when a link is clicked
        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
