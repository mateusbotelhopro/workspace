// Hero video: fade-in suave ao começar a tocar (evita flash de imagem)
(function () {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  function showVideo() {
    clearTimeout(fallbackTimer);
    video.classList.add('playing');
  }

  // Vídeo já está tocando (cache ou carregamento rápido)
  if (!video.paused && video.readyState >= 3) {
    showVideo();
    return;
  }
  video.addEventListener('playing', showVideo, { once: true });

  // Fallback: se o vídeo não tocar em 3s (bloqueio mobile etc.), mostra poster normalmente
  const fallbackTimer = setTimeout(() => { video.classList.add('playing'); }, 3000);
})();

// Header: sólido ao rolar (null-safe para páginas sem header fixo)
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Nav: active link baseado na seção visível (somente section[id])
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (!navLinks.length || !sections.length) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('nav-link-active', link.getAttribute('href') === id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-74px 0px -45% 0px' });

  sections.forEach(el => sectionObserver.observe(el));
})();

// Mobile nav — body scroll lock (resolve bug iOS Safari)
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  let menuScrollY = 0;

  function openMenu() {
    menuScrollY = window.scrollY;
    nav.classList.add('open');
    navToggle.classList.add('open');
    // Fixa o body na posição atual para bloquear scroll no iOS
    document.body.style.overflow  = 'hidden';
    document.body.style.position  = 'fixed';
    document.body.style.top       = `-${menuScrollY}px`;
    document.body.style.width     = '100%';
  }

  function closeMenu() {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    // Remove o lock e restaura a posição de scroll
    document.body.style.overflow  = '';
    document.body.style.position  = '';
    document.body.style.top       = '';
    document.body.style.width     = '';
    window.scrollTo(0, menuScrollY);
  }

  navToggle.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Scroll reveal com stagger
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Cookie banner
const cookieBanner  = document.getElementById('cookieBanner');
const cookieAceitar = document.getElementById('cookieAceitar');
const cookieRecusar = document.getElementById('cookieRecusar');

if (cookieBanner && !localStorage.getItem('elo-cookies')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 900);
}

function dismissCookie(value) {
  localStorage.setItem('elo-cookies', value);
  cookieBanner.classList.remove('visible');
}

if (cookieAceitar) cookieAceitar.addEventListener('click', () => dismissCookie('accepted'));
if (cookieRecusar) cookieRecusar.addEventListener('click', () => dismissCookie('declined'));

// WhatsApp float: sobe quando cookie banner está visível (evita sobreposição mobile)
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat && cookieBanner) {
  function updateWaPosition() {
    if (window.innerWidth > 768) { waFloat.style.bottom = ''; return; }
    waFloat.style.bottom = cookieBanner.classList.contains('visible')
      ? (cookieBanner.offsetHeight + 12) + 'px'
      : '20px';
  }
  const bannerObserver = new MutationObserver(updateWaPosition);
  bannerObserver.observe(cookieBanner, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', updateWaPosition, { passive: true });
}

// Formulário de contato — envio via Web3Forms
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn      = document.getElementById('submitBtn');
    const textEl   = document.getElementById('submitText');
    const iconEl   = document.getElementById('submitIcon');
    const original = textEl.textContent;

    // Validação básica
    let valid = true;
    ['nome', 'email'].forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      field.classList.remove('field-error');
      if (!field.value.trim() || (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
        field.classList.add('field-error');
        valid = false;
        field.addEventListener('input', () => field.classList.remove('field-error'), { once: true });
      }
    });
    if (!valid) return;

    // Estado de carregamento
    btn.disabled = true;
    textEl.textContent = 'Enviando...';
    iconEl.style.opacity = '0.5';

    try {
      const formData = new FormData(this);
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (typeof fbq === 'function') fbq('track', 'Lead');
        window.location.href = 'obrigado.html';
      } else {
        throw new Error(data.message || 'Erro no envio');
      }
    } catch (err) {
      textEl.textContent = 'Erro ao enviar. Tente novamente.';
      iconEl.style.opacity = '1';
      btn.disabled = false;
      setTimeout(() => { textEl.textContent = original; }, 3500);
    }
  });
}
