/* Diego Alvarez Rincón — interacciones v2 (liquid glass)
   GSAP + ScrollTrigger (CDN). Respeta prefers-reduced-motion. */

(function () {
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined';

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.querySelector('.mobile-menu');
  var iconMenu = toggle ? toggle.querySelector('.icon-menu') : null;
  var iconX = toggle ? toggle.querySelector('.icon-x') : null;

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (iconMenu) iconMenu.style.display = open ? 'none' : '';
    if (iconX) iconX.style.display = open ? '' : 'none';
  }

  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- Contadores de métricas ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var duration = 1600;
    var start = null;

    function fmt(v) {
      var s = decimals > 0
        ? v.toFixed(decimals).replace('.', ',')
        : Math.round(v).toLocaleString('es-CO');
      return prefix + s + suffix;
    }

    if (reduceMotion) { el.textContent = fmt(target); return; }

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.metric__num');
  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  if (!hasGsap || reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero: entrada ---------- */
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero__title .line > span', { yPercent: 110, duration: 1.0, stagger: 0.12 }, 0.15)
    .from('.hero__kicker', { opacity: 0, y: 14, duration: 0.6 }, '-=0.55')
    .from('.hero__sub', { opacity: 0, y: 18, duration: 0.7 }, '-=0.35')
    .from('.hero__ctas', { opacity: 0, y: 18, duration: 0.7 }, '-=0.45')
    .from('.nav', { opacity: 0, y: -12, duration: 0.7 }, 0.3);

  /* ---------- Reveals por scroll ---------- */
  function revealBatch(selector, opts) {
    gsap.utils.toArray(selector).forEach(function (el, i) {
      gsap.from(el, Object.assign({
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: 'power3.out',
        delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 86%' }
      }, opts || {}));
    });
  }

  revealBatch('.metric');
  revealBatch('.section-index');
  revealBatch('.section-title');
  revealBatch('.about__text', { y: 40 });
  revealBatch('.about__facts p');
  revealBatch('.about__photo');
  revealBatch('.build-card');
  revealBatch('.exp__item', { y: 24 });
  revealBatch('.post-card');
  revealBatch('.creds__col');
  revealBatch('.contact__inner', { y: 40 });

  /* Título de contacto: líneas tipo hero */
  gsap.from('.contact__title .line > span', {
    yPercent: 110,
    duration: 0.95,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 82%' }
  });

  /* Skills: stagger de chips */
  gsap.from('.creds__skills li', {
    opacity: 0,
    y: 14,
    duration: 0.5,
    stagger: 0.04,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.creds__skills', start: 'top 88%' }
  });
})();
