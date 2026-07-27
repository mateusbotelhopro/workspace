// ─── Navbar scroll ────────────────────────────────────────────────────────────
const mainNav = document.getElementById('main-nav');
if (mainNav) {
    window.addEventListener('scroll', () => {
        mainNav.classList.toggle('nav-scrolled', window.scrollY > 40);
    }, { passive: true });
}
