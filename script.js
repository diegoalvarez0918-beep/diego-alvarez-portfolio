/* Diego Alvarez Rincón — interacciones
   GSAP + ScrollTrigger (CDN). Respeta prefers-reduced-motion. */

(function () {
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined';

  /* ---------- Contadores de métricas (sin GSAP, con rAF) ---------- */
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
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
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

  /* ---------- Hero: timeline de entrada ---------- */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero__title .line > span', {
      yPercent: 110,
      duration: 1.0,
      stagger: 0.12
    })
    .from('.hero__kicker', { opacity: 0, y: 14, duration: 0.6 }, '-=0.55')
    .from('.hero__sub', { opacity: 0, y: 18, duration: 0.7 }, '-=0.35')
    .from('.hero__ctas', { opacity: 0, y: 18, duration: 0.7 }, '-=0.45')
    .from('.hero__photo-frame', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.1,
      ease: 'power4.inOut'
    }, 0.25)
    .from('.hero__tag', { opacity: 0, y: 12, duration: 0.6 }, '-=0.4')
    .from('.hero__scroll', { opacity: 0, duration: 0.6 }, '-=0.3');

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
  revealBatch('.build-card');
  revealBatch('.exp__item', { y: 24 });
  revealBatch('.post-card');
  revealBatch('.creds__col');
  revealBatch('.contact__sub');
  revealBatch('.contact__ctas');

  /* Título de contacto: líneas tipo hero */
  gsap.from('.contact__title .line > span', {
    yPercent: 110,
    duration: 0.95,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 82%' }
  });

  /* Parallax sutil de la foto */
  gsap.to('.hero__photo-frame img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
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
